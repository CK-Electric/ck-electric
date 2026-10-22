<?php
if (!defined('WP_CLI') || !WP_CLI) { return; }
require_once __DIR__ . '/hcp-test-runner.php';

function ck_hcp_test_client() {
    // The old DevKinsta environment is quarantined. Real HCP tests are allowed
    // only from WP-CLI on the verified staging host, with public delivery off.
    if (!ck_estimates_enabled()
        || wp_parse_url(home_url(), PHP_URL_HOST) !== 'stg-ckelectric-staging.kinsta.cloud'
        || wp_get_environment_type() !== 'staging'
        || !defined('CK_ESTIMATES_HCP_ENABLED')
        || CK_ESTIMATES_HCP_ENABLED !== false) {
        throw new CK_HCP_Test_Error('staging_cli_test_requires_public_delivery_disabled');
    }
    $file = defined('CK_ESTIMATES_HCP_KEY_FILE') ? CK_ESTIMATES_HCP_KEY_FILE : '';
    $real = $file ? realpath($file) : false;
    $public = realpath(ABSPATH);
    if (!$real || is_link($file) || !$public || strpos($real, $public . '/') === 0
        || !is_file($real) || !is_readable($real) || (fileperms($real) & 0077) !== 0) {
        throw new CK_HCP_Test_Error('key_file_missing_or_permissions_not_private');
    }
    return new CK_HCP_Test_Client(trim(file_get_contents($real)));
}
function ck_hcp_test_journal_dir() {
    $root = defined('CK_ESTIMATES_PRIVATE_DIR') ? realpath(CK_ESTIMATES_PRIVATE_DIR) : false;
    $public = realpath(ABSPATH);
    if (!$root || !$public || strpos($root . '/', $public . '/') === 0 || !is_writable($root)) {
        throw new CK_HCP_Test_Error('private_storage_unavailable');
    }
    $dir = $root . '/hcp-test-runs';
    if (!is_dir($dir) && !mkdir($dir, 0700) && !is_dir($dir)) { throw new CK_HCP_Test_Error('journal_directory_failed'); }
    if (is_link($dir) || !chmod($dir, 0700)) { throw new CK_HCP_Test_Error('journal_directory_failed'); }
    return $dir;
}
WP_CLI::add_command('ck-estimates hcp-check', function () {
    try {
        $data = ck_hcp_test_client()->request('GET', '/company')['data'];
        if (($data['id'] ?? '') !== 'b358b9df-b6fe-48d7-aa90-5a0f4a818848') { throw new CK_HCP_Test_Error('unexpected_housecall_company'); }
        WP_CLI::success('Read-only authentication verified for CK Electric LLC. No records created.');
    } catch (CK_HCP_Test_Error $e) { WP_CLI::error($e->reason); }
});
WP_CLI::add_command('ck-estimates hcp-test', function ($args, $assoc) {
    $lock = null;
    try {
        if (!isset($assoc['send'])) { throw new CK_HCP_Test_Error('explicit_send_flag_required'); }
        $id = $args[0] ?? '';
        if (!preg_match('/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/', $id)) { throw new CK_HCP_Test_Error('invalid_request_id'); }
        $client = ck_hcp_test_client();
        global $wpdb;
        $row = $wpdb->get_row($wpdb->prepare('SELECT * FROM ' . ck_estimates_table() . ' WHERE request_id = %s', $id));
        if (!$row) { throw new CK_HCP_Test_Error('local_request_not_found'); }
        $dir = ck_hcp_test_journal_dir();
        $lock = fopen($dir . '/' . $id . '.lock', 'c');
        chmod($dir . '/' . $id . '.lock', 0600);
        if (!$lock || !flock($lock, LOCK_EX | LOCK_NB)) { throw new CK_HCP_Test_Error('test_already_running'); }
        $runner = new CK_HCP_Test_Runner($client, $row, $dir . '/' . $id . '.json');
        WP_CLI::line(wp_json_encode(isset($assoc['reconcile-estimate']) ? $runner->reconcile_estimate() : (isset($assoc['reconcile-photos']) ? $runner->reconcile_photos() : $runner->run())));
    } catch (CK_HCP_Test_Error $e) {
        // Output only a fixed diagnostic code. Upstream bodies and keys stay out of logs.
        WP_CLI::error($e->reason . ($e->retry_at ? ' (retry after ' . gmdate('c', $e->retry_at) . ')' : ''), false);
        if ($lock) { fclose($lock); }
        WP_CLI::halt(1);
    } finally { if (is_resource($lock)) { fclose($lock); } }
}, array('synopsis' => '<request-id> [--send] [--reconcile-estimate] [--reconcile-photos]'));
