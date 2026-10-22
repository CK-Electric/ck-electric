<?php
require_once __DIR__ . "/format.php";
/** Local CLI acceptance-test adapter. Never registered as a public REST handler. */
if (!defined('ABSPATH')) { exit; }

class CK_HCP_Test_Error extends RuntimeException {
    public $reason;
    public $retry_at;
    public function __construct($reason, $retry_at = 0) {
        $this->reason = $reason;
        $this->retry_at = $retry_at;
        parent::__construct($reason); // Fixed codes only; never upstream response bodies or credentials.
    }
}

class CK_HCP_Test_Client {
    protected $key;
    protected $transport;
    public function __construct($key, $transport = null) {
        if (!is_string($key) || strlen($key) < 16 || preg_match('/\s/', $key)) { throw new CK_HCP_Test_Error('key_missing_or_invalid'); }
        $this->key = $key;
        $this->transport = $transport ?: 'wp_remote_request';
    }
    public function request($method, $path, $body = null, $content_type = 'application/json') {
        if (!preg_match('#^/(company|customers|estimates)(/|\?|$)#', $path) || strpos($path, '..') !== false || preg_match('/[\r\n]/', $path)) {
            throw new CK_HCP_Test_Error('invalid_api_path');
        }
        $args = array('method' => $method, 'timeout' => 30, 'redirection' => 0, 'sslverify' => true,
            'limit_response_size' => 2 * MB_IN_BYTES,
            'headers' => array('Authorization' => 'Token ' . $this->key, 'Accept' => 'application/json', 'Content-Type' => $content_type));
        if ($body !== null) { $args['body'] = is_array($body) ? wp_json_encode($body) : $body; }
        $response = call_user_func($this->transport, 'https://api.housecallpro.com' . $path, $args);
        if (is_wp_error($response)) { throw new CK_HCP_Test_Error($method === 'GET' ? 'connection_failed' : 'write_outcome_unknown'); }
        $status = wp_remote_retrieve_response_code($response);
        if ($status < 200 || $status >= 300) {
            $reason = in_array($status, array(401, 403), true) ? 'authentication_or_permission_denied' :
                ($status === 429 ? 'rate_limited' : (in_array($status, array(400, 404, 405, 413, 415, 422), true) ? 'request_rejected' :
                ($method === 'GET' ? 'upstream_unavailable' : 'write_outcome_unknown')));
            $reset = (int) wp_remote_retrieve_header($response, 'ratelimit-reset');
            $retry = (string) wp_remote_retrieve_header($response, 'retry-after');
            $retry_at = ctype_digit($retry) ? time() + (int) $retry : (strtotime($retry) ?: 0);
            throw new CK_HCP_Test_Error($reason, $status === 429 ? max(time() + 60, $reset, $retry_at) : 0);
        }
        $decoded = json_decode(wp_remote_retrieve_body($response), true);
        if (!is_array($decoded) || json_last_error() !== JSON_ERROR_NONE) {
            throw new CK_HCP_Test_Error($method === 'GET' ? 'invalid_response' : 'write_outcome_unknown');
        }
        return array('status' => $status, 'data' => $decoded);
    }
}

class CK_HCP_Runner {
    protected $client;
    protected $file;
    protected $state;
    protected $row;
    protected $data;
    protected $photos;
    protected $save;
    public function __construct($client, $row, $file, $save = null, $initial_state = null) {
        $this->client = $client; $this->row = $row; $this->file = $file; $this->save = $save;
        $this->data = json_decode($row->payload, true);
        $this->photos = json_decode($row->photos, true);
        $this->validate_identity();
        if ($initial_state !== null) {
            $this->state = $initial_state;
        } elseif ($file && is_file($file)) {
            $this->state = json_decode(file_get_contents($file), true);
            if (!is_array($this->state) || ($this->state['fingerprint'] ?? '') !== $row->fingerprint) { throw new CK_HCP_Test_Error('journal_mismatch'); }
        } else {
            $this->state = array('request_id' => $row->request_id, 'fingerprint' => $row->fingerprint, 'steps' => array(), 'note_format' => 2, 'mode' => $this->is_test() ? 'test' : 'intake');
        }
        if (!is_array($this->state) || ($this->state['fingerprint'] ?? '') !== $row->fingerprint ||
            ($this->state['request_id'] ?? '') !== $row->request_id ||
            ($this->state['mode'] ?? 'test') !== ($this->is_test() ? 'test' : 'intake')) {
            throw new CK_HCP_Test_Error('journal_mismatch');
        }
    }
    protected function is_synthetic_test_contact() {
        $phone = preg_replace('/[^0-9]/', '', (string)($this->data['phone'] ?? ''));
        return ($this->data['first'] ?? '') === 'CK TEST'
            && ($this->data['email'] ?? '') === 'ck-form-test@example.invalid'
            && in_array($phone, array('2065550100', '12065550100'), true);
    }
    protected function is_test() { return true; }
    protected function validate_identity() {
        if (!is_array($this->data) || !is_array($this->photos) ||
            !$this->is_synthetic_test_contact() || !in_array($this->row->kind, array('ev', 'panel'), true)) {
            throw new CK_HCP_Test_Error('synthetic_test_records_only');
        }
    }
    protected function title() {
        return ($this->is_test() ? 'TEST ONLY' : 'Website request') . ' — ' . ($this->row->kind === 'ev' ? 'EV charger' : 'Panel replacement') . ' — ' . $this->row->request_id;
    }
    protected function customer_body($address) {
        return array('first_name'=>'CK TEST', 'last_name'=>'Website ' . $this->row->request_id,
            'email'=>'ck-form-test@example.invalid', 'notifications_enabled'=>false,
            'notes'=>'INTEGRATION TEST ONLY — ' . $this->row->request_id, 'addresses'=>array($address));
    }
    protected function before_customer() {}
    protected function persist() {
        if ($this->save) { call_user_func($this->save, $this->state); return; }
        $temp = $this->file . '.tmp';
        if (file_put_contents($temp, wp_json_encode($this->state), LOCK_EX) === false || !chmod($temp, 0600) || !rename($temp, $this->file)) {
            throw new CK_HCP_Test_Error('journal_write_failed');
        }
    }
    private function write_step($name, $path, $body, $validate, $content_type = 'application/json') {
        $old = $this->state['steps'][$name] ?? array();
        if (($old['state'] ?? '') === 'done') { return $old['result']; }
        if (in_array($old['state'] ?? '', array('in_flight', 'unknown'), true)) { throw new CK_HCP_Test_Error('manual_reconciliation_required_' . $name); }
        if (($old['retry_at'] ?? 0) > time()) { throw new CK_HCP_Test_Error('rate_limited', $old['retry_at']); }
        $this->state['steps'][$name] = array('state' => 'in_flight'); $this->persist();
        try {
            $response = $this->client->request('POST', $path, $body, $content_type);
            $result = call_user_func($validate, $response['data'], $response['status']);
            if ($result === false) { throw new CK_HCP_Test_Error('write_outcome_unknown'); }
        } catch (CK_HCP_Test_Error $error) {
            $safe = in_array($error->reason, array('rate_limited', 'request_rejected', 'authentication_or_permission_denied'), true);
            $this->state['steps'][$name] = array('state' => $safe ? 'rejected' : 'unknown', 'error' => $error->reason, 'retry_at' => $error->retry_at);
            $this->persist(); throw $error;
        }
        $this->state['steps'][$name] = array('state' => 'done', 'result' => $result); $this->persist();
        return $result;
    }
    public static function valid_id($id) { return is_string($id) && preg_match('/^[a-zA-Z0-9_-]{1,128}$/', $id); }
    public function reconcile_estimate() {
        $company = $this->client->request('GET', '/company')['data'];
        if (($company['id'] ?? '') !== 'b358b9df-b6fe-48d7-aa90-5a0f4a818848') { throw new CK_HCP_Test_Error('unexpected_housecall_company'); }
        $customer = $this->state['steps']['customer']['result']['id'] ?? '';
        if (!self::valid_id($customer) || !in_array($this->state['steps']['estimate']['state'] ?? '', array('unknown', 'in_flight'), true)) { throw new CK_HCP_Test_Error('no_uncertain_estimate_to_reconcile'); }
        $list = $this->client->request('GET', '/estimates?customer_id=' . rawurlencode($customer) . '&page_size=100')['data'];
        $matches = array();
        $title = $this->title();
        foreach (($list['estimates'] ?? array()) as $e) {
            foreach (($e['options'] ?? array()) as $o) {
                if (($o['name'] ?? '') === $title && ($e['customer']['id'] ?? '') === $customer && ($e['company_id'] ?? '') === $company['id'] && self::valid_id($e['id'] ?? null) && self::valid_id($o['id'] ?? null)) {
                    $matches[] = array('id'=>$e['id'], 'option_id'=>$o['id'], 'number'=>(string)($e['estimate_number'] ?? ''));
                }
            }
        }
        if (count($matches) !== 1 || ($list['total_pages'] ?? 1) > 1) { throw new CK_HCP_Test_Error('estimate_reconciliation_not_unique'); }
        $this->state['steps']['estimate'] = array('state'=>'done','result'=>$matches[0],'reconciled_at'=>gmdate('c'));
        $this->persist(); return array('status'=>'reconciled','estimate_id'=>$matches[0]['id']);
    }
    public function reconcile_photos() {
        $company = $this->client->request('GET', '/company')['data'];
        if (($company['id'] ?? '') !== 'b358b9df-b6fe-48d7-aa90-5a0f4a818848') { throw new CK_HCP_Test_Error('unexpected_housecall_company'); }
        $customer = $this->state['steps']['customer']['result']['id'] ?? '';
        $estimate = $this->state['steps']['estimate']['result'] ?? array();
        if (!self::valid_id($customer) || !self::valid_id($estimate['id'] ?? null)) { throw new CK_HCP_Test_Error('missing_remote_ids'); }
        $list = $this->client->request('GET', '/estimates?customer_id=' . rawurlencode($customer) . '&expand%5B%5D=attachments&page_size=100')['data'];
        $attachments = array();
        foreach (($list['estimates'] ?? array()) as $e) {
            if (($e['id'] ?? '') !== $estimate['id'] || ($e['company_id'] ?? '') !== $company['id'] || ($e['customer']['id'] ?? '') !== $customer) { continue; }
            foreach (($e['options'] ?? array()) as $o) { if (($o['id'] ?? '') === $estimate['option_id']) { $attachments = $o['attachments'] ?? array(); } }
        }
        $count = 0;
        foreach ($this->photos as $photo) {
            $step = 'photo_' . $photo['field'];
            if (!in_array($this->state['steps'][$step]['state'] ?? '', array('unknown', 'in_flight'), true)) { continue; }
            $name = ($this->is_test() ? 'CK-TEST-' : 'CK-REQUEST-') . $this->row->request_id . '-' . sanitize_file_name($photo['field']) . '.' . pathinfo($photo['path'], PATHINFO_EXTENSION);
            $matches = array_values(array_filter($attachments, function ($a) use ($name) { return ($a['file_name'] ?? '') === $name && self::valid_id($a['id'] ?? null); }));
            if (count($matches) !== 1) { throw new CK_HCP_Test_Error('photo_reconciliation_not_unique'); }
            $this->state['steps'][$step] = array('state'=>'done','result'=>array('accepted'=>true, 'id'=>$matches[0]['id']),'reconciled_at'=>gmdate('c'));
            $this->persist(); $count++;
        }
        return array('status'=>'reconciled','photos'=>$count);
    }
    public function run() {
        $company = $this->client->request('GET', '/company')['data'];
        if (($company['id'] ?? '') !== 'b358b9df-b6fe-48d7-aa90-5a0f4a818848') { throw new CK_HCP_Test_Error('unexpected_housecall_company'); }
        $d = $this->data; $id = $this->row->request_id;
        $address = array('street' => $d['street'], 'street_line_2' => $d['unit'] ?? '', 'city' => $d['city'], 'state' => $d['state'], 'zip' => $d['zip'], 'country' => 'US');
        if (in_array($this->state['steps']['customer']['state'] ?? 'new', array('new', 'rejected'), true)) { $this->before_customer(); }
        $customer = $this->write_step('customer', '/customers', $this->customer_body($address), function ($r, $status) {
                return $status === 201 && self::valid_id($r['id'] ?? null) && ($r['notifications_enabled'] ?? null) === false ? array('id' => $r['id']) : false;
            });
        $title = $this->title();
        // No schedule, assignment, send endpoint, or price: this is an unscheduled intake test.
        $estimate = $this->write_step('estimate', '/estimates', array('customer_id' => $customer['id'],
            'address' => $address, 'options' => array(array('name' => $title))), function ($r, $status) use ($customer) {
                if (!in_array($status, array(200, 201), true) || !self::valid_id($r['id'] ?? null) || !self::valid_id($r['options'][0]['id'] ?? null)
                    || ($r['customer']['id'] ?? '') !== $customer['id']) { return false; }
                return array('id' => $r['id'], 'option_id' => $r['options'][0]['id'], 'number' => (string) ($r['estimate_number'] ?? ''));
            });
        $option_path = '/estimates/' . rawurlencode($estimate['id']) . '/options/' . rawurlencode($estimate['option_id']);
        $lines = array($title, ($this->is_test() ? 'Website integration test only. Do not contact, schedule, or send pricing.' : 'Website estimate request. Visit preferences are not confirmed appointments.'), 'Answers:');
        // Preserve old journal formatting so completed tests still verify without new writes.
        $answers = ($this->state['note_format'] ?? 1) === 2 ? ck_estimates_readable_answers($d) : $d;
        foreach ($answers as $key => $value) { $lines[] = $key . ': ' . $value; }
        $lines[] = 'Visit times are preferences in America/Los_Angeles, not appointments.';
        $note = implode("\n", $lines);
        $note_result = $this->write_step('note', $option_path . '/notes', array('content' => $note), function ($r, $status) use ($note) {
            return $status === 201 && self::valid_id($r['id'] ?? null) && ($r['content'] ?? '') === $note ? array('id' => $r['id']) : false;
        });
        $expected_files = array();
        foreach ($this->photos as $photo) {
            $root = realpath(CK_ESTIMATES_PRIVATE_DIR); $path = realpath($photo['path']);
            if (!$root || !$path || strpos($path, $root . '/' . $id . '/') !== 0 || !hash_equals($photo['sha256'], hash_file('sha256', $path))) {
                throw new CK_HCP_Test_Error('photo_integrity_failed');
            }
            $name = ($this->is_test() ? 'CK-TEST-' : 'CK-REQUEST-') . $id . '-' . sanitize_file_name($photo['field']) . '.' . pathinfo($path, PATHINFO_EXTENSION);
            $expected_files[] = $name;
            $boundary = 'ck' . bin2hex(random_bytes(16));
            $body = '--' . $boundary . "\r\nContent-Disposition: form-data; name=\"file\"; filename=\"" . $name . "\"\r\nContent-Type: " . $photo['mime'] . "\r\n\r\n" . file_get_contents($path) . "\r\n--" . $boundary . "--\r\n";
            $this->write_step('photo_' . $photo['field'], $option_path . '/attachments', $body, function ($r, $status) {
                // Receipt shapes vary; only independent attachment read-back confirms success.
                return in_array($status, array(200, 201, 202), true) ? array('accepted' => true) : false;
            }, 'multipart/form-data; boundary=' . $boundary);
        }
        // An accepted upload is not yet confirmed: re-read the estimate before reporting completion.
        $found = null;
        for ($page = 1; $page <= 10 && !$found; $page++) {
            $list = $this->client->request('GET', '/estimates?customer_id=' . rawurlencode($customer['id']) . '&expand%5B%5D=attachments&page_size=100&page=' . $page)['data'];
            if (!isset($list['estimates']) || !is_array($list['estimates'])) { throw new CK_HCP_Test_Error('invalid_estimate_list'); }
            foreach ($list['estimates'] as $candidate) { if (($candidate['id'] ?? '') === $estimate['id']) { $found = $candidate; break; } }
            if (count($list['estimates']) < 100) { break; }
        }
        $option = null;
        foreach (($found['options'] ?? array()) as $candidate) { if (($candidate['id'] ?? '') === $estimate['option_id']) { $option = $candidate; } }
        $note_ok = false;
        foreach (($option['notes'] ?? array()) as $n) { if (($n['id'] ?? '') === $note_result['id'] && ($n['content'] ?? '') === $note) { $note_ok = true; } }
        $file_names = array_column($option['attachments'] ?? array(), 'file_name');
        $confirmed = $found && ($found['customer']['id'] ?? '') === $customer['id'] && (($customer['source'] ?? 'new') === 'existing' || ($found['customer']['notifications_enabled'] ?? null) === false)
            && ($found['company_id'] ?? '') === $company['id'] && in_array($found['work_status'] ?? '', array('unscheduled', 'needs scheduling'), true)
            && empty($found['assigned_employees']) && empty($found['schedule']['scheduled_start']) && $note_ok && !array_diff($expected_files, $file_names);
        $this->state['verification'] = array('status' => $confirmed ? 'verified' : 'needs_verification',
            'estimate_id' => $estimate['id'], 'estimate_number' => $estimate['number'],
            'note_confirmed' => $note_ok, 'photos_expected' => count($expected_files),
            'photos_confirmed' => count(array_intersect($expected_files, $file_names)), 'checked_at' => gmdate('c'));
        $this->persist();
        return $this->state['verification'];
    }
}

/** Compatibility wrapper: CLI acceptance tests retain their synthetic-only gate. */
class CK_HCP_Test_Runner extends CK_HCP_Runner {}

/** Customer requests use durable database checkpoints supplied by the worker. */
class CK_HCP_Intake_Runner extends CK_HCP_Runner {
    protected function is_test() {
        return $this->is_synthetic_test_contact();
    }
    protected function validate_identity() {
        if (!is_array($this->data) || !is_array($this->photos) || !in_array($this->row->kind, array('ev', 'panel'), true)) { throw new CK_HCP_Test_Error('invalid_saved_request'); }
        foreach (array('first','last','email','phone','street','city','state','zip') as $key) {
            if (!isset($this->data[$key]) || !is_string($this->data[$key]) || $this->data[$key] === '') { throw new CK_HCP_Test_Error('invalid_saved_request'); }
        }
        if (!is_email($this->data['email'])) { throw new CK_HCP_Test_Error('invalid_saved_request'); }
    }
    protected function customer_body($address) {
        return array('first_name'=>$this->data['first'], 'last_name'=>$this->data['last'],
            'email'=>$this->data['email'], 'mobile_number'=>preg_replace('/[^0-9+]/','',$this->data['phone']),
            'notifications_enabled'=>false, 'notes'=>($this->is_test() ? 'INTEGRATION TEST ONLY — ' : 'Website request reference: ') . $this->row->request_id,
            'addresses'=>array($address));
    }
    protected function before_customer() {
        // Match Rob's flow: search email first, then phone; use exact field matches,
        // not fuzzy search results. Existing profiles and notification settings stay untouched.
        $email = strtolower(trim($this->data['email']));
        $digits = function ($value) { return preg_replace('/[^0-9]/', '', (string)$value); };
        $phone = $digits($this->data['phone']);
        foreach (array($email, $phone) as $query) {
            for ($page = 1; $page <= 10; $page++) {
                $list = $this->client->request('GET', '/customers?q=' . rawurlencode($query) . '&page_size=100&page=' . $page)['data'];
                if (!isset($list['customers']) || !is_array($list['customers']) || !isset($list['total_items']) || !is_numeric($list['total_items'])) { throw new CK_HCP_Test_Error('invalid_customer_list'); }
                foreach ($list['customers'] as $customer) {
                    if (!is_array($customer)) { throw new CK_HCP_Test_Error('invalid_customer_list'); }
                    $email_match = strtolower(trim((string)($customer['email'] ?? ''))) === $email;
                    $phone_match = in_array($phone, array($digits($customer['mobile_number'] ?? ''), $digits($customer['home_number'] ?? ''), $digits($customer['work_number'] ?? '')), true);
                    if ($email_match || $phone_match) {
                        if (!self::valid_id($customer['id'] ?? null)) { throw new CK_HCP_Test_Error('invalid_customer_list'); }
                        $this->state['steps']['customer'] = array('state'=>'done', 'result'=>array('id'=>$customer['id'], 'source'=>'existing'), 'matched_by'=>$email_match ? 'email' : 'phone');
                        $this->persist();
                        return;
                    }
                }
                if ($page * 100 >= (int)$list['total_items']) { break; }
                if (!$list['customers'] || $page === 10) { throw new CK_HCP_Test_Error('customer_search_incomplete'); }
            }
        }
        // No exact match: the ordinary checkpointed create step will create the contact.
    }
}
