<?php
/**
 * Plugin Name: CK Estimate Requests
 * Description: Secure estimate request intake with server-configured Housecall Pro delivery.
 * Version: 0.3.0
 * Requires PHP: 7.4
 */
if (!defined('ABSPATH')) { exit; }

require_once __DIR__ . '/includes/environment.php';
function ck_estimates_table() { global $wpdb; return $wpdb->prefix . 'ck_estimate_requests'; }
function ck_estimates_install() {
    if (!ck_estimates_enabled()) { wp_die('This plugin requires explicit local or staging configuration on an allowed host.'); }
    global $wpdb;
    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    $table = ck_estimates_table(); $collate = $wpdb->get_charset_collate();
    dbDelta("CREATE TABLE $table (
        request_id varchar(36) NOT NULL,
        fingerprint varchar(64) NOT NULL,
        kind varchar(16) NOT NULL,
        status varchar(32) NOT NULL,
        payload longtext NOT NULL,
        photos longtext NOT NULL,
        result longtext NOT NULL,
        attempts int NOT NULL DEFAULT 0,
        created_at datetime NOT NULL,
        updated_at datetime NOT NULL,
        available_at datetime DEFAULT NULL,
        PRIMARY KEY  (request_id),
        KEY queue_due (status, available_at)
    ) $collate;");
}
register_activation_hook(__FILE__, 'ck_estimates_install');
add_action('init', function () {
    if (ck_estimates_enabled() && get_option('ck_estimates_schema') !== '2') {
        ck_estimates_install();
        global $wpdb;
        if ($wpdb->get_var("SHOW COLUMNS FROM " . ck_estimates_table() . " LIKE 'available_at'")) { update_option('ck_estimates_schema', '2', false); }
    }
}, 1);
function ck_estimates_error($message, $status = 422) { return new WP_Error('ck_estimates_error', $message, array('status' => $status)); }
function ck_estimates_permission($request) {
    if (!ck_estimates_enabled()) { return ck_estimates_error('Estimate integration is disabled.', 404); }
    if (!hash_equals('Bearer ' . ck_estimates_connection_token(), (string) $request->get_header('authorization'))) {
        return ck_estimates_error('Unauthorized.', 401);
    }
    return true;
}
function ck_estimates_limits() {
    return array('file_bytes' => min(15 * MB_IN_BYTES, wp_max_upload_size()),
        'total_bytes' => min(30 * MB_IN_BYTES, max(0, wp_convert_hr_to_bytes(ini_get('post_max_size')) - MB_IN_BYTES)),
        'max_files' => min(18, (int) ini_get('max_file_uploads')),
        'mode' => ck_estimates_delivery_mode() === 'hcp' ? 'housecall-pro' : 'local-mock');
}
add_action('rest_api_init', function () {
    if (!ck_estimates_enabled()) { return; }
    register_rest_route('ck-estimates/v1', '/limits', array('methods' => 'GET', 'permission_callback' => 'ck_estimates_permission', 'callback' => 'ck_estimates_limits'));
    register_rest_route('ck-estimates/v1', '/requests', array('methods' => 'POST', 'permission_callback' => 'ck_estimates_permission', 'callback' => 'ck_estimates_submit'));
});

/** Normalize only fields belonging to the active branch; never trust browser validation. */
function ck_estimates_validate($raw, $kind) {
    if (!is_array($raw) || !in_array($kind, array('ev', 'panel'), true)) { return ck_estimates_error('Invalid form.'); }
    $d = array();
    foreach ($raw as $key => $value) {
        if (!is_string($value) || strlen($value) > 8000) { return ck_estimates_error('Invalid field value.'); }
        $d[$key] = $key === 'comments' ? sanitize_textarea_field($value) : sanitize_text_field($value);
    }
    $clean = array();
    foreach (array('first', 'last', 'phone', 'email', 'street', 'city', 'state', 'zip') as $key) {
        if (empty($d[$key]) || strlen($d[$key]) > 150) { return ck_estimates_error('Please check your contact details: ' . $key . '.'); }
        $clean[$key] = $d[$key];
    }
    if (!is_email($clean['email']) || !preg_match('/^(1)?[0-9]{10}$/', preg_replace('/[\s().+\-]/', '', $clean['phone']))
        || !preg_match('/^[A-Za-z]{2}$/', $clean['state']) || !preg_match('/^\d{5}(-\d{4})?$/', $clean['zip'])) {
        return ck_estimates_error('Please check your email, phone, state and ZIP code.');
    }
    foreach (array('unit', 'comments') as $key) { $clean[$key] = $d[$key] ?? ''; }
    if (strlen($clean['unit']) > 150 || mb_strlen($clean['comments']) > 2000) { return ck_estimates_error('Comments or unit number are too long.'); }
    $clean['state'] = strtoupper($clean['state']);
    $clean['email'] = strtolower($clean['email']);
    $required = array(); $allowed = array();
    $choices = array('location' => array('indoors', 'outdoors'));
    if ($kind === 'ev') {
        $choices['charger'] = array('hardwired', 'nema');
        $choices['distance'] = array('yes', 'no', 'unsure');
        if (($d['charger'] ?? '') === 'hardwired') { $choices['supply'] = array('yes', 'no'); }
        if (($d['distance'] ?? '') === 'yes') { $required = array('panel', 'location'); }
        else {
            $today = new DateTimeImmutable('today', new DateTimeZone('America/Los_Angeles'));
            $seen = array();
            for ($i = 0; $i < 3; $i++) {
                $date = $d['date' . $i] ?? '';
                $parsed = DateTimeImmutable::createFromFormat('!Y-m-d', $date, new DateTimeZone('America/Los_Angeles'));
                if (!$parsed || $parsed->format('Y-m-d') !== $date || $parsed <= $today || $parsed > $today->modify('+42 days') || $parsed->format('N') > 5 || in_array($date, $seen, true)) {
                    return ck_estimates_error('Choose three different future weekdays within six weeks.');
                }
                $seen[] = $date; $clean['date' . $i] = $date;
                foreach (array('from', 'to') as $key) {
                    $time = $d[$key . $i] ?? '';
                    if (!preg_match('/^\d{2}:(00|15|30|45)$/', $time) || $time < '06:00' || $time > '14:00') { return ck_estimates_error('Choose visit times between 6 a.m. and 2 p.m. Pacific.'); }
                    $clean[$key . $i] = $time;
                }
                if ($clean['from' . $i] >= $clean['to' . $i]) { return ck_estimates_error('Visit end times must be after start times.'); }
            }
        }
    } else {
        if (!isset($d['count']) || !preg_match('/^[1-6]$/', $d['count'])) { return ck_estimates_error('Choose between one and six panels.'); }
        $clean['count'] = $d['count'];
        if ((int) $d['count'] > 1) { $choices['location'][] = 'both'; }
        $choices['known'] = array('yes', 'no');
        for ($i = 0; $i < (int) $d['count']; $i++) {
            $required[] = 'panel' . $i . '-door'; $required[] = 'panel' . $i . '-back';
            if (($d['known'] ?? '') === 'yes') {
                $choices['amps' . $i] = array('90', '125', '200', 'other');
                if (($d['amps' . $i] ?? '') === 'other') {
                    $amps = $d['other' . $i] ?? '';
                    if (!preg_match('/^\d{2,4}$/', $amps) || (int) $amps < 15 || (int) $amps > 1200) { return ck_estimates_error('Enter amperage between 15 and 1200.'); }
                    $clean['other' . $i] = $amps;
                }
            }
        }
        for ($i = 0; $i < 6; $i++) { $allowed[] = 'extra' . $i; }
    }
    foreach ($choices as $key => $options) {
        if (!isset($d[$key]) || !in_array($d[$key], $options, true)) { return ck_estimates_error('Please answer the project question: ' . $key . '.'); }
        $clean[$key] = $d[$key];
    }
    return array('payload' => $clean, 'required' => $required, 'allowed' => array_merge($required, $allowed));
}
function ck_estimates_receipt($row) {
    $result = json_decode($row->result, true) ?: array();
    $mode = ($result['adapter'] ?? 'mock') === 'hcp' ? 'housecall-pro' : 'local-mock';
    $message = 'Your request is saved.';
    if ($mode === 'local-mock' && $row->status === 'completed') { $message = 'This is a test submission. It was not sent to Housecall Pro.'; }
    elseif ($row->status === 'completed') { $message = 'Your request was received. The CK Electric team will follow up.'; }
    elseif ($row->status === 'needs_attention') { $message = 'Your details are saved, but we could not confirm delivery. Please contact CK Electric and share this reference.'; }
    elseif (in_array($row->status, array('received', 'processing', 'retry_wait'), true)) { $message = 'Your details are saved and are still being submitted. Keep this reference; contact CK Electric if you do not hear back.'; }
    return array('reference' => 'LOCAL-' . $row->request_id, 'status' => $row->status,
        'mode' => $mode, 'saved' => true, 'attempts' => (int) $row->attempts,
        'photo_count' => count(json_decode($row->photos, true) ?: array()),
        'processing' => array('message' => $message), 'notification' => 'disabled');
}
function ck_estimates_submit($request) {
    global $wpdb;
    if (!empty($request->get_param('contact_website'))) {
        return ck_estimates_error('Could not submit this request. Please try again.');
    }
    $id = $request->get_param('request_id');
    if (!is_string($id) || !preg_match('/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/', $id)) { return ck_estimates_error('Invalid request identifier.'); }
    $kind = $request->get_param('kind');
    $payload = $request->get_param('payload');
    if (!is_string($payload) || strlen($payload) > 20000) { return ck_estimates_error('Invalid submission.'); }
    $checked = ck_estimates_validate(json_decode($payload, true), $kind);
    if (is_wp_error($checked)) { return $checked; }
    $files = $request->get_file_params(); $limits = ck_estimates_limits(); $hashes = array(); $total = 0;
    if (count($files) > $limits['max_files']) { return ck_estimates_error('Too many photos.'); }
    foreach ($checked['required'] as $key) { if (empty($files[$key])) { return ck_estimates_error('Please provide the required photo: ' . $key . '.'); } }
    foreach ($files as $key => $file) {
        if (!in_array($key, $checked['allowed'], true) || !is_array($file) || is_array($file['error'] ?? null) || ($file['error'] ?? -1) !== UPLOAD_ERR_OK || !is_uploaded_file($file['tmp_name'])) { return ck_estimates_error('A photo could not be uploaded. Check its size and try again.'); }
        $size = filesize($file['tmp_name']); $total += $size;
        if ($size <= 0 || $size > $limits['file_bytes'] || $total > $limits['total_bytes']) { return ck_estimates_error('Photos exceed the local upload limit.', 413); }
        $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
        $extensions = array('image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/heic' => 'heic', 'image/heif' => 'heif');
        if (!isset($extensions[$mime])) { return ck_estimates_error('Unsupported photo content. Use a JPG, PNG, WEBP or HEIC image.'); }
        if (in_array($mime, array('image/jpeg', 'image/png', 'image/webp'), true) && !@getimagesize($file['tmp_name'])) { return ck_estimates_error('This photo is not a readable image.'); }
        $files[$key]['extension'] = $extensions[$mime]; $files[$key]['mime'] = $mime;
        $hashes[$key] = hash_file('sha256', $file['tmp_name']);
    }
    ksort($hashes); ksort($checked['payload']);
    $fingerprint = hash('sha256', wp_json_encode(array($kind, $checked['payload'], $hashes)));
    $table = ck_estimates_table();
    // A per-request database lock serializes retries, including simultaneous clicks.
    $lock = 'ck-estimate-' . $id;
    if ((int) $wpdb->get_var($wpdb->prepare('SELECT GET_LOCK(%s, 0)', $lock)) !== 1) { return ck_estimates_error('This request is still processing. Please retry shortly.', 409); }
    $process_now = false;
    try {
        $row = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table WHERE request_id = %s", $id));
        if ($row) {
            if (!hash_equals($row->fingerprint, $fingerprint)) { return ck_estimates_error('This reference belongs to different answers. Start a new request.', 409); }
            $process_now = in_array($row->status, array('received', 'processing'), true)
                || ($row->status === 'retry_wait' && (!$row->available_at || strtotime($row->available_at . ' UTC') <= time()));
        } else {
            $root = realpath(CK_ESTIMATES_PRIVATE_DIR); $public = realpath(ABSPATH);
            if (!$root || !$public || strpos($root . '/', $public . '/') === 0 || !is_writable($root)) { return ck_estimates_error('Private local storage is unavailable.', 503); }
            $dir = $root . '/' . $id;
            if (!mkdir($dir, 0700)) { return ck_estimates_error('Could not create private photo storage.', 503); }
            $manifest = array();
            foreach ($files as $key => $file) {
                $path = $dir . '/' . $key . '.' . $file['extension'];
                if (!move_uploaded_file($file['tmp_name'], $path)) {
                    foreach ($manifest as $photo) { unlink($photo['path']); } rmdir($dir);
                    return ck_estimates_error('Could not save photos. Please retry.', 503);
                }
                chmod($path, 0600);
                $manifest[] = array('field' => $key, 'name' => sanitize_file_name($file['name']), 'path' => $path, 'mime' => $file['mime'], 'sha256' => $hashes[$key]);
            }
            $saved = $wpdb->insert($table, array('request_id' => $id, 'fingerprint' => $fingerprint, 'kind' => $kind,
                'status' => 'received', 'payload' => wp_json_encode($checked['payload']), 'photos' => wp_json_encode($manifest),
                'result' => wp_json_encode(array('adapter' => ck_estimates_delivery_mode(), 'simulate_failure' => ck_estimates_environment() === 'local' && ck_estimates_delivery_mode() === 'mock' && $request->get_param('simulate_failure') === '1')), 'attempts' => 0, 'created_at' => gmdate('Y-m-d H:i:s'), 'updated_at' => gmdate('Y-m-d H:i:s')));
            if (!$saved) {
                foreach ($manifest as $photo) { unlink($photo['path']); } rmdir($dir);
                return ck_estimates_error('Could not save this request. Please retry.', 503);
            }
            $row = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table WHERE request_id = %s", $id));
            $process_now = true;
        }
    } finally { $wpdb->get_var($wpdb->prepare('SELECT RELEASE_LOCK(%s)', $lock)); }
    // The request and private photos are durable before any CRM network call starts.
    // The normal delivery path is synchronous; the existing scheduled sweep remains
    // a recovery path for interrupted work and safe transient retries.
    if ($process_now) { ck_estimates_process($id); }
    $row = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table WHERE request_id = %s", $id));
    if (!$row) { return ck_estimates_error('Your request could not be confirmed. Please try again with the same answers.', 503); }
    $code = in_array($row->status, array('received', 'processing', 'retry_wait'), true) ? 202 : 200;
    return new WP_REST_Response(ck_estimates_receipt($row), $code);
}

// Live acceptance tests are CLI-only; browser submissions remain mock.
if (defined('WP_CLI') && WP_CLI) { require_once __DIR__ . '/includes/hcp-cli.php'; }

require_once __DIR__ . '/includes/queue.php';
require_once __DIR__ . '/includes/admin.php';
