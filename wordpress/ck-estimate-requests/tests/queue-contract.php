<?php
// Run only with WP CLI on the configured local site. No external requests.
if (!defined('WP_CLI') || !WP_CLI || !ck_estimates_enabled()) { exit(1); }
global $wpdb; $table = ck_estimates_table(); $ids = array();
function ck_queue_assert($condition, $label) { if (!$condition) { throw new RuntimeException($label); } WP_CLI::log('PASS: ' . $label); }
try {
    foreach (array(false, true) as $fail) {
        $id = wp_generate_uuid4(); $ids[] = $id;
        $wpdb->insert($table, array('request_id'=>$id, 'fingerprint'=>str_repeat('a',64), 'kind'=>'ev', 'status'=>'received', 'payload'=>'{}', 'photos'=>'[]', 'result'=>wp_json_encode(array('adapter'=>'mock','simulate_failure'=>$fail)), 'attempts'=>0, 'created_at'=>gmdate('Y-m-d H:i:s'), 'updated_at'=>gmdate('Y-m-d H:i:s')));
        // Exercise the inline processing function used after the durable save.
        ck_estimates_process($id);
        $row = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table WHERE request_id=%s",$id));
        ck_queue_assert($row->status === ($fail ? 'needs_attention' : 'completed') && (int)$row->attempts === 1, 'inline processing records expected result');
        ck_estimates_process($id);
        ck_queue_assert((int)$wpdb->get_var($wpdb->prepare("SELECT attempts FROM $table WHERE request_id=%s",$id)) === 1, 'worker does not replay finished or failed request');
        $wpdb->update($table, array('status'=>'processing','updated_at'=>gmdate('Y-m-d H:i:s',time()-1200)), array('request_id'=>$id));
        ck_estimates_process($id);
        $row=$wpdb->get_row($wpdb->prepare("SELECT * FROM $table WHERE request_id=%s",$id));
        ck_queue_assert($row->status==='needs_attention' && json_decode($row->result,true)['retryable']===false && (int)$row->attempts===1, 'interrupted outcome requires review instead of automatic replay');
    }
    WP_CLI::success('Synchronous processing checks passed; no Housecall Pro calls.');
} finally { foreach ($ids as $id) { $wpdb->delete($table,array('request_id'=>$id)); } }
