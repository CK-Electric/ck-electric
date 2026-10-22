<?php
if (!defined('WP_CLI') || !WP_CLI || !ck_estimates_enabled()) { exit(1); }
add_filter('pre_http_request', function () { return new WP_Error('offline','No network during tests.'); });
add_filter('pre_wp_mail', '__return_true');
add_filter('wp_die_handler', function () { return function () { throw new RuntimeException('access_denied'); }; });
function admin_assert($label,$ok) { if (!$ok) { throw new LogicException('FAIL: '.$label); } WP_CLI::log('PASS: '.$label); }
function admin_denied($label,$fn) { try { $fn(); } catch(RuntimeException $e) { admin_assert($label,$e->getMessage()==='access_denied'); return; } throw new LogicException('FAIL: '.$label); }
global $wpdb; $table=ck_estimates_table(); $id=wp_generate_uuid4(); $dir=CK_ESTIMATES_PRIVATE_DIR.'/'.$id; mkdir($dir,0700); $path=$dir.'/sample.png';file_put_contents($path,'local-test');
$outside=tempnam(sys_get_temp_dir(),'ck-outside-');file_put_contents($outside,'private');
$manifest=array(array('field'=>'panel','path'=>$path,'name'=>'sample.png','sha256'=>hash_file('sha256',$path)));
$wpdb->insert($table,array('request_id'=>$id,'fingerprint'=>str_repeat('f',64),'kind'=>'ev','status'=>'needs_attention','payload'=>wp_json_encode(array('first'=>'<script>alert(1)</script>','comments'=>'<img src=x onerror=alert(1)>')),'photos'=>wp_json_encode($manifest),'result'=>wp_json_encode(array('adapter'=>'mock','retryable'=>true)),'created_at'=>gmdate('Y-m-d H:i:s'),'updated_at'=>gmdate('Y-m-d H:i:s')));
$user_ids=array(); $original=$_SERVER['REQUEST_METHOD'] ?? 'GET';
try {
    foreach(array('anonymous','subscriber','editor') as $role) {
        $uid=0;
        if($role!=='anonymous') { $uid=wp_insert_user(array('user_login'=>'ck-permission-'.wp_generate_uuid4(),'user_pass'=>wp_generate_password(32),'role'=>$role)); $user_ids[]=$uid; }
        wp_set_current_user($uid);
        admin_denied($role.' cannot read dashboard',function(){ck_estimates_admin_page();});
        admin_denied($role.' cannot download private photo',function() use($id){ck_estimates_private_photo($id,0);});
        admin_denied($role.' cannot retry request',function() use($id){ck_estimates_retry($id);});
    }
    $admin=get_user_by('login','erika-local');wp_set_current_user($admin->ID);
    $_GET['request']=$id;ob_start();ck_estimates_admin_page();$html=ob_get_clean();
    admin_assert('saved answers escaped in admin',strpos($html,'<script>alert(1)</script>')===false && strpos($html,'&lt;script&gt;')!==false && strpos($html,'<img src=x')===false);
    admin_assert('authorized photo resolves private path',ck_estimates_private_photo($id,0)===$path);
    admin_assert('missing photo rejected',is_wp_error(ck_estimates_private_photo($id,99)));
    file_put_contents($path,'changed');admin_assert('modified photo rejected',is_wp_error(ck_estimates_private_photo($id,0)));
    $manifest[0]['path']=$outside;$manifest[0]['sha256']=hash_file('sha256',$outside);$wpdb->update($table,array('photos'=>wp_json_encode($manifest)),array('request_id'=>$id));
    admin_assert('outside-storage path rejected',is_wp_error(ck_estimates_private_photo($id,0)));
    $_SERVER['REQUEST_METHOD']='POST';$_POST=array('request'=>$id);$_REQUEST=array('_wpnonce'=>'invalid');
    admin_denied('retry requires valid nonce',function(){do_action('admin_post_ck_estimates_retry');});
    $_GET=array('request'=>$id,'photo'=>0);$_REQUEST=array('_wpnonce'=>'invalid');
    admin_denied('photo download requires valid nonce',function(){do_action('admin_post_ck_estimates_photo');});
    $_SERVER['REQUEST_METHOD']='GET';
    admin_denied('retry requires POST',function(){do_action('admin_post_ck_estimates_retry');});
    admin_assert('valid admin can queue safe retry',ck_estimates_retry($id)===true);
    $row=$wpdb->get_row($wpdb->prepare("SELECT * FROM $table WHERE request_id=%s",$id));$result=json_decode($row->result,true);
    admin_assert('retry audit identifies operator',$result['retried_by']===$admin->ID && count($result['retry_history'])===1);
    admin_assert('queued request cannot be retried twice',is_wp_error(ck_estimates_retry($id)));
    WP_CLI::success('Admin permission, nonce, escaping and private-file checks passed.');
} finally {
    $_SERVER['REQUEST_METHOD']=$original;$_GET=array();$_REQUEST=array();$_POST=array();
    wp_clear_scheduled_hook('ck_estimates_process',array($id));$wpdb->delete($table,array('request_id'=>$id));
    unlink($path);rmdir($dir);unlink($outside);
    require_once ABSPATH.'wp-admin/includes/user.php';foreach($user_ids as $uid){wp_delete_user($uid);}
}
