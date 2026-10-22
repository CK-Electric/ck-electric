<?php
if (!defined('WP_CLI') || !WP_CLI || !ck_estimates_enabled()) { exit(1); }
// Fail closed if any test accidentally invokes a real HTTP transport.
$unexpected_http=0;
add_filter('pre_http_request', function () use (&$unexpected_http) { $unexpected_http++; return new WP_Error('network_forbidden','Offline tests prohibit network calls.'); });
function worker_assert($label,$value) { if (!$value) { throw new RuntimeException('FAIL: '.$label); } WP_CLI::log('PASS: '.$label); }
function worker_response($code,$data) { return array('response'=>array('code'=>$code),'body'=>wp_json_encode($data),'headers'=>array('retry-after'=>'120')); }
class CK_Worker_Fake {
    public $scenario; public $calls=array(); public $note=''; public $photo=''; public $visible=true; public $customer_body;
    public function __construct($scenario) { $this->scenario=$scenario; }
    public function send($url,$args) {
        $path=parse_url($url,PHP_URL_PATH); $method=$args['method']; $key=$method.' '.$path;
        $this->calls[$key]=($this->calls[$key] ?? 0)+1;
        if ($this->scenario==='get_failure' && $path==='/company') { return new WP_Error('timeout','PRIVATE MUST NOT LEAK'); }
        if ($this->scenario==='wrong_company' && $path==='/company') { return worker_response(200,array('id'=>'wrong')); }
        if ($path==='/company') { return worker_response(200,array('id'=>'b358b9df-b6fe-48d7-aa90-5a0f4a818848')); }
        if ($path==='/customers' && $method==='GET') {
            parse_str(parse_url($url,PHP_URL_QUERY),$query);
            $found=array();
            if ($this->scenario==='existing_customer') { $found=array(array('id'=>'customer','email'=>'OFFLINE@example.invalid')); }
            if ($this->scenario==='phone_match' && $query['q']==='2065550100') { $found=array(array('id'=>'customer','work_number'=>'(206) 555-0100')); }
            if ($this->scenario==='fuzzy_match') { $found=array(array('id'=>'unrelated','email'=>'someoneelse@example.invalid','mobile_number'=>'2065550199')); }
            return worker_response(200,array('customers'=>$found,'total_items'=>count($found)));
        }
        if ($method==='POST') {
            if ($path==='/customers' && $this->scenario==='auth') { return worker_response(401,array('secret'=>'PRIVATE MUST NOT LEAK')); }
            if ($path==='/estimates') {
                if ($this->scenario==='timeout') { return new WP_Error('timeout','PRIVATE MUST NOT LEAK'); }
                if ($this->scenario==='rate_limit') { return worker_response(429,array()); }
                if ($this->scenario==='server_error') { return worker_response(503,array()); }
                if ($this->scenario==='missing_id') { return worker_response(201,array()); }
            }
            if (strpos($path,'/attachments')!==false) {
                if ($this->scenario==='photo_rejected') { return worker_response(422,array()); }
                preg_match('/filename="([^"]+)"/',$args['body'],$match); $this->photo=$match[1]; return worker_response(202,array('accepted'=>true));
            }
            $body=json_decode($args['body'],true);
            if ($path==='/customers') { $this->customer_body=$body; return worker_response(201,array('id'=>'customer','notifications_enabled'=>false)); }
            if ($path==='/estimates') { return worker_response(201,array('id'=>'estimate','estimate_number'=>999,'customer'=>array('id'=>'customer'),'options'=>array(array('id'=>'option')))); }
            $this->note=$body['content']; return worker_response(201,array('id'=>'note','content'=>$this->note));
        }
        return worker_response(200,array('estimates'=>array(array('id'=>'estimate','company_id'=>'b358b9df-b6fe-48d7-aa90-5a0f4a818848','customer'=>array('id'=>'customer','notifications_enabled'=>in_array($this->scenario,array('existing_customer','phone_match'),true)),'work_status'=>'needs scheduling','options'=>array(array('id'=>'option','notes'=>array(array('id'=>'note','content'=>$this->note)),'attachments'=>$this->photo && $this->visible?array(array('id'=>'photo','file_name'=>$this->photo)):array()))))));
    }
    public function count($key) { return $this->calls[$key] ?? 0; }
}
global $wpdb; $table=ck_estimates_table(); $created=array(); $dirs=array();
$get=function($id) use($wpdb,$table) { return $wpdb->get_row($wpdb->prepare("SELECT * FROM $table WHERE request_id=%s",$id)); };
$fixture=function($photo=false) use($wpdb,$table,&$created,&$dirs) {
    $id=wp_generate_uuid4(); $created[]=$id; $photos=array();
    if ($photo) {
        $dir=CK_ESTIMATES_PRIVATE_DIR.'/'.$id; mkdir($dir,0700); $dirs[]=$dir; $path=$dir.'/panel.png';
        file_put_contents($path,base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII='));
        $photos[]=array('field'=>'panel','path'=>$path,'mime'=>'image/png','name'=>'sample.png','sha256'=>hash_file('sha256',$path));
    }
    $data=array('first'=>'Offline','last'=>'Sample','email'=>'offline@example.invalid','phone'=>'2065550100','street'=>'123 Test Street','city'=>'Kirkland','state'=>'WA','zip'=>'98033','charger'=>'hardwired','supply'=>'yes','location'=>'indoors','distance'=>'no','date0'=>'2026-10-27','from0'=>'08:30','to0'=>'10:00','date1'=>'2026-10-28','from1'=>'10:00','to1'=>'12:00','date2'=>'2026-10-29','from2'=>'12:00','to2'=>'14:00');
    $wpdb->insert($table,array('request_id'=>$id,'fingerprint'=>hash('sha256',$id),'kind'=>'ev','status'=>'received','payload'=>wp_json_encode($data),'photos'=>wp_json_encode($photos),'result'=>wp_json_encode(array('adapter'=>'hcp')),'created_at'=>gmdate('Y-m-d H:i:s'),'updated_at'=>gmdate('Y-m-d H:i:s')));
    return $id;
};
$due=function($id) use($wpdb,$table) { $wpdb->update($table,array('available_at'=>gmdate('Y-m-d H:i:s',time()-1)),array('request_id'=>$id)); };
$admin=get_user_by('login','erika-local'); wp_set_current_user($admin->ID);
try {
    foreach(array('ok','auth','rate_limit','timeout','server_error','missing_id','get_failure','wrong_company','existing_customer','phone_match','fuzzy_match','photo_rejected','delayed_photo') as $scenario) {
        $id=$fixture(in_array($scenario,array('photo_rejected','delayed_photo'),true)); $fake=new CK_Worker_Fake($scenario); $fake->visible=$scenario!=='delayed_photo';
        $client=new CK_HCP_Test_Client('OFFLINE-FAKE-CREDENTIAL',array($fake,'send'));
        ck_estimates_run_worker($id,$client); $row=$get($id); $result=json_decode($row->result,true);
        worker_assert($scenario.' stores safe diagnostic only',strpos($row->result,'PRIVATE MUST NOT LEAK')===false && strpos($row->result,'OFFLINE-FAKE-CREDENTIAL')===false);
        if ($scenario==='ok') {
            worker_assert('worker completes only after read-back',$row->status==='completed' && $result['verification']['note_confirmed']);
            worker_assert('intake customer has submitted contact fields',$fake->customer_body['first_name']==='Offline' && $fake->customer_body['mobile_number']==='2065550100');
            worker_assert('all visit preferences human-readable',strpos($fake->note,'Visit preference 3: Thursday, October 29, 2026 — 12:00 PM–2:00 PM Pacific time')!==false && strpos($fake->note,'date0:')===false);
            ck_estimates_run_worker($id,$client);
            worker_assert('completed queue job does not replay',$fake->count('POST /estimates')===1 && $fake->count('POST /customers')===1);
            worker_assert('public receipt hides internal journal',!isset(ck_estimates_receipt($row)['processing']['journal']));
        } elseif (in_array($scenario,array('timeout','server_error','missing_id'),true)) {
            worker_assert($scenario.' stops uncertain writes',$row->status==='needs_attention' && !ck_estimates_retryable($result));
            worker_assert($scenario.' manual retry blocked',is_wp_error(ck_estimates_retry($id)));
            ck_estimates_run_worker($id,$client); worker_assert($scenario.' no duplicate estimate',$fake->count('POST /estimates')===1);
        } elseif ($scenario==='wrong_company') {
            worker_assert($scenario.' requires review before creating records',$row->status==='needs_attention' && $fake->count('POST /customers')===0);
        } elseif (in_array($scenario,array('existing_customer','phone_match'),true)) {
            worker_assert('existing customer reused automatically',$row->status==='completed' && $fake->count('POST /customers')===0 && $fake->count('POST /estimates')===1);
            worker_assert('customer match saved durably',$result['journal']['steps']['customer']['result']['source']==='existing');
        } elseif ($scenario==='fuzzy_match') {
            worker_assert('unrelated search result does not block or match',$row->status==='completed' && $fake->count('POST /customers')===1);
        } elseif ($scenario==='rate_limit') {
            worker_assert('rate limit stops inline submission and records a cooldown',$row->status==='needs_attention' && strtotime($row->available_at.' UTC')>time());
            ck_estimates_run_worker($id,$client); worker_assert('failed request is not automatically replayed',$fake->count('POST /estimates')===1);
            worker_assert('admin retry respects cooldown',is_wp_error(ck_estimates_retry($id,$client)));
            // Advance both persisted clocks rather than actually waiting two minutes.
            $result['journal']['steps']['estimate']['retry_at']=time()-1;
            $result['retry_at']=time()-1;
            $wpdb->update($table,array('result'=>wp_json_encode($result),'available_at'=>gmdate('Y-m-d H:i:s',time()-1)),array('request_id'=>$id)); $fake->scenario='ok';
            ck_estimates_retry($id,$client);
            worker_assert('admin retry resumes without duplicating customer',$get($id)->status==='completed' && $fake->count('POST /customers')===1);
        } elseif ($scenario==='delayed_photo') {
            worker_assert('accepted photo is not marked complete before read-back',$row->status==='needs_attention');
            $fake->visible=true;
            $result['retry_at']=time()-1;
            $wpdb->update($table,array('result'=>wp_json_encode($result),'available_at'=>gmdate('Y-m-d H:i:s',time()-1)),array('request_id'=>$id));
            ck_estimates_retry($id,$client);
            worker_assert('admin read-back retry does not upload photo twice',$get($id)->status==='completed' && $fake->count('POST /estimates/estimate/options/option/attachments')===1);
        } elseif ($scenario==='get_failure') {
            worker_assert('temporary lookup failure is reported without an automatic retry',$get($id)->status==='needs_attention' && (int)$get($id)->attempts===1);
            worker_assert('temporary lookup failure has a safe retry cooldown',is_wp_error(ck_estimates_retry($id,$client)));
        } else {
            worker_assert($scenario.' safe manual retry offered',$row->status==='needs_attention' && ck_estimates_retryable($result));
            $fake->scenario='ok'; worker_assert('authorized retry processes same request synchronously',ck_estimates_retry($id,$client)===true);
            $finished=$get($id);
            worker_assert($scenario.' retry completes remaining steps',$finished->status==='completed');
            if ($scenario==='photo_rejected') { worker_assert('photo retry preserves customer estimate and note',$fake->count('POST /customers')===1 && $fake->count('POST /estimates')===1 && $fake->count('POST /estimates/estimate/options/option/notes')===1); }
            worker_assert('retry audit recorded',count(json_decode($finished->result,true)['retry_history'])===1);
        }
    }
    $id=$fixture(); $other=new wpdb(DB_USER,DB_PASSWORD,DB_NAME,DB_HOST);
    $fake=new CK_Worker_Fake('ok');$client=new CK_HCP_Test_Client('OFFLINE-FAKE-CREDENTIAL',array($fake,'send'));
    $other->get_var($other->prepare('SELECT GET_LOCK(%s, 0)','ck-estimate-'.$id));
    try {
        ck_estimates_run_worker($id,$client);
        worker_assert('concurrent worker cannot claim locked request',(int)$get($id)->attempts===0 && !$fake->calls);
    } finally { $other->get_var($other->prepare('SELECT RELEASE_LOCK(%s)','ck-estimate-'.$id)); $other->close(); }
    ck_estimates_run_worker($id,$client); worker_assert('request completes once lock is available',$get($id)->status==='completed');
    $id=$fixture();$fake=new CK_Worker_Fake('ok');$client=new CK_HCP_Test_Client('OFFLINE-FAKE-CREDENTIAL',array($fake,'send'));
    // Simulate a database outage on checkpoint updates. No remote write may precede its saved intent.
    $break_journal=function($query) use($table) {
        return strpos($query,'UPDATE `'.$table.'`')===0 && strpos($query,'journal')!==false ? 'UPDATE ck_deliberately_missing_table SET invalid=1' : $query;
    };
    $previous=$wpdb->suppress_errors();add_filter('query',$break_journal);
    try { ck_estimates_run_worker($id,$client); }
    finally { remove_filter('query',$break_journal);$wpdb->suppress_errors($previous); }
    worker_assert('checkpoint storage failure prevents remote creation',$fake->count('POST /customers')===0 && $get($id)->status==='processing');
    $wpdb->update($table,array('updated_at'=>gmdate('Y-m-d H:i:s',time()-1200)),array('request_id'=>$id));
    ck_estimates_run_worker($id,$client);
    worker_assert('interrupted worker becomes needs attention',$get($id)->status==='needs_attention' && $fake->count('POST /customers')===0);
    $id=$fixture(); ck_estimates_run_worker($id);
    worker_assert('live delivery remains disabled without explicit configuration',json_decode($get($id)->result,true)['error']==='delivery_disabled');
    worker_assert('no real HTTP transport invoked',$unexpected_http===0);
    WP_CLI::success('Worker integration tests passed without network access.');
} finally {
    foreach($created as $id) { wp_clear_scheduled_hook('ck_estimates_process',array($id)); $wpdb->delete($table,array('request_id'=>$id)); }
    foreach($dirs as $dir) { foreach(glob($dir.'/*') as $path) { unlink($path); } rmdir($dir); }
}
