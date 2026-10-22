<?php
if (!defined('ABSPATH')) { exit; }
require_once __DIR__ . '/hcp-test-runner.php';

function ck_estimates_delivery_mode() {
    return defined('CK_ESTIMATES_HCP_ENABLED') && CK_ESTIMATES_HCP_ENABLED === true ? 'hcp' : 'mock';
}
function ck_estimates_worker_client() {
    if (ck_estimates_delivery_mode() !== 'hcp') { throw new CK_HCP_Test_Error('delivery_disabled'); }
    $file = defined('CK_ESTIMATES_HCP_KEY_FILE') ? CK_ESTIMATES_HCP_KEY_FILE : '';
    $real = $file ? realpath($file) : false; $public = realpath(ABSPATH);
    if (!$real || is_link($file) || !$public || strpos($real, $public . '/') === 0 || !is_file($real) || !is_readable($real) || (fileperms($real) & 0077) !== 0) {
        throw new CK_HCP_Test_Error('key_file_missing_or_permissions_not_private');
    }
    return new CK_HCP_Test_Client(trim(file_get_contents($real)));
}
function ck_estimates_store_result($id, $status, $result, $available = null) {
    global $wpdb;
    if ($wpdb->update(ck_estimates_table(), array('status'=>$status,'result'=>wp_json_encode($result),'available_at'=>$available,'updated_at'=>gmdate('Y-m-d H:i:s')),array('request_id'=>$id)) === false) {
        throw new CK_HCP_Test_Error('journal_write_failed');
    }
}
/** Only known rejections or read-only checks can be replayed. Unknown writes always stop. */
function ck_estimates_retryable($result) {
    foreach (($result['journal']['steps'] ?? array()) as $step) {
        if (in_array($step['state'] ?? '',array('in_flight','unknown'),true)) { return false; }
    }
    return !empty($result['retryable']);
}
function ck_estimates_process($id) { ck_estimates_run_worker($id); }
// Injected clients are exclusively for offline WP-CLI tests, never REST parameters.
function ck_estimates_run_worker($id, $test_client = null) {
    if (!ck_estimates_enabled()) { return; }
    if ($test_client && !(defined('WP_CLI') && WP_CLI)) { throw new RuntimeException('CLI test transport only'); }
    global $wpdb; $table=ck_estimates_table(); $lock='ck-estimate-'.$id; $customer_lock=null;
    if ((int)$wpdb->get_var($wpdb->prepare('SELECT GET_LOCK(%s, 0)',$lock)) !== 1) { return; }
    try {
        $row=$wpdb->get_row($wpdb->prepare("SELECT * FROM $table WHERE request_id=%s",$id));
        if (!$row || !in_array($row->status,array('received','retry_wait','processing'),true)) { return; }
        if ($row->available_at && strtotime($row->available_at.' UTC') > time()) { return; }
        $result=json_decode($row->result,true) ?: array();
        if ($row->status==='processing') {
            if (strtotime($row->updated_at.' UTC') > time()-600) { return; }
            $result['retryable']=false; $result['error']='interrupted_processing';
            $result['message']='Processing was interrupted. Review saved steps and Housecall Pro before retrying.';
            ck_estimates_store_result($id,'needs_attention',$result); return;
        }
        $mode=$result['adapter'] ?? 'mock';
        if ($mode==='hcp') {
            // Serialize customer discovery across requests, preventing concurrent duplicate creation.
            $customer_lock='ck-hcp-customer-discovery';
            if ((int)$wpdb->get_var($wpdb->prepare('SELECT GET_LOCK(%s, 0)',$customer_lock)) !== 1) { $customer_lock=null; return; }
        }
        if ($wpdb->update($table,array('status'=>'processing','attempts'=>$row->attempts+1,'updated_at'=>gmdate('Y-m-d H:i:s')),array('request_id'=>$id)) === false) { return; }
        if ($mode==='mock') {
            $failed=!empty($result['simulate_failure']);
            $result['adapter']='mock'; $result['retryable']=$failed;
            $result['message']=$failed ? 'Simulated failure. A local retry is safe.' : 'Local simulation completed. Nothing sent to Housecall Pro.';
            ck_estimates_store_result($id,$failed?'needs_attention':'completed',$result); return;
        }
        if ($mode!=='hcp') { throw new CK_HCP_Test_Error('invalid_adapter'); }
        try {
            $client=$test_client ?: ck_estimates_worker_client();
            $save=function($journal) use ($id,&$result) {
                $result['journal']=$journal;
                ck_estimates_store_result($id,'processing',$result);
            };
            $runner=new CK_HCP_Intake_Runner($client,$row,'',$save,$result['journal'] ?? null);
            $verified=$runner->run();
            $result['verification']=$verified;
            if ($verified['status']!=='verified') { throw new CK_HCP_Test_Error('verification_pending'); }
            unset($result['error'],$result['retry_at']); $result['retryable']=false;
            $result['message']='Housecall Pro estimate #'.$verified['estimate_number'].' verified, including answers and photos.';
            ck_estimates_store_result($id,'completed',$result);
        } catch (CK_HCP_Test_Error $error) {
            $safe_to_retry=in_array($error->reason,array('rate_limited','connection_failed','upstream_unavailable','verification_pending'),true);
            $result['error']=$error->reason;
            $result['retryable']=$safe_to_retry || in_array($error->reason,array('authentication_or_permission_denied','request_rejected','delivery_disabled','key_missing_or_invalid','key_file_missing_or_permissions_not_private'),true);
            $result['retryable']=ck_estimates_retryable($result);
            $retry_at=max($error->retry_at,time()+min(3600,60*(2**min(6,(int)$row->attempts))));
            $result['retry_at']=$retry_at;
            $result['message']=$result['retryable']
                ? 'Saved. Delivery could not be confirmed; an administrator can review the failed step and retry safely.'
                : 'Saved. Delivery needs review before any retry.';
            ck_estimates_store_result($id,'needs_attention',$result);
        }
    } catch (Throwable $error) {
        // If recording the outcome failed, leave the durable in-flight state for recovery.
        // Do not log exception text: transports may include private payloads or credentials.
    } finally {
        if ($customer_lock) { $wpdb->get_var($wpdb->prepare('SELECT RELEASE_LOCK(%s)',$customer_lock)); }
        $wpdb->get_var($wpdb->prepare('SELECT RELEASE_LOCK(%s)',$lock));
    }
}
function ck_estimates_retry($id, $test_client = null) {
    ck_estimates_admin_guard();
    if ($test_client && !(defined('WP_CLI') && WP_CLI)) { throw new RuntimeException('CLI test transport only'); }
    global $wpdb; $table=ck_estimates_table(); $lock='ck-estimate-'.$id;
    if ((int)$wpdb->get_var($wpdb->prepare('SELECT GET_LOCK(%s, 0)',$lock))!==1) { return new WP_Error('busy','This request is processing.'); }
    $retry_now = false;
    try {
        $row=$wpdb->get_row($wpdb->prepare("SELECT * FROM $table WHERE request_id=%s",$id));
        $result=$row ? json_decode($row->result,true) : array();
        if (!$row || $row->status!=='needs_attention' || !ck_estimates_retryable($result)) { return new WP_Error('unsafe','This request cannot be safely retried.'); }
        if (($result['retry_at'] ?? 0)>time()) { return new WP_Error('cooldown','Wait until the delivery cooldown ends.'); }
        $result['retried_by']=get_current_user_id(); $result['retried_at']=gmdate('Y-m-d H:i:s');
        $result['retry_history'][]=array('user'=>get_current_user_id(),'at'=>$result['retried_at']);
        $result['simulate_failure']=false; $result['retryable']=false;
        ck_estimates_store_result($id,'received',$result);
        $retry_now = true;
    } catch (CK_HCP_Test_Error $e) { return new WP_Error('storage','Could not save retry.'); }
    finally { $wpdb->get_var($wpdb->prepare('SELECT RELEASE_LOCK(%s)',$lock)); }
    if ($retry_now) { ck_estimates_run_worker($id, $test_client); }
    return true;
}
