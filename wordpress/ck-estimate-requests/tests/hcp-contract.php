<?php
// Run with wp eval-file. All HCP transport calls are replaced with deterministic fakes.
require_once WP_PLUGIN_DIR . '/ck-estimate-requests/includes/hcp-test-runner.php';
function ck_test_assert($label, $condition) { if (!$condition) { throw new RuntimeException('FAIL: ' . $label); } WP_CLI::line('PASS: ' . $label); }
function ck_test_response($code, $data, $headers = array()) { return array('response' => array('code' => $code), 'body' => is_string($data) ? $data : wp_json_encode($data), 'headers' => $headers); }
$key = 'FAKE-KEY-FOR-OFFLINE-TESTS';
foreach (array(
    array(401, '{}', 'authentication_or_permission_denied'), array(403, '{}', 'authentication_or_permission_denied'),
    array(422, '{}', 'request_rejected'), array(429, '{}', 'rate_limited'), array(500, '{}', 'write_outcome_unknown'),
    array(302, '{}', 'write_outcome_unknown'), array(200, '<html>bad</html>', 'write_outcome_unknown'),
    array(200, 'null', 'write_outcome_unknown'),
) as $case) {
    $client = new CK_HCP_Test_Client($key, function ($url, $args) use ($case, $key) {
        ck_test_assert('HTTPS, Token auth, no redirects', strpos($url, 'https://api.housecallpro.com/') === 0 && $args['redirection'] === 0 && $args['sslverify'] && $args['headers']['Authorization'] === 'Token ' . $key);
        return ck_test_response($case[0], $case[1], array('ratelimit-reset' => time()+120));
    });
    try { $client->request('POST', '/estimates', array()); throw new RuntimeException('Expected rejection'); }
    catch (CK_HCP_Test_Error $e) { ck_test_assert('response ' . $case[0] . ' handled safely', $e->reason === $case[2] && strpos($e->getMessage(), $key) === false && ($case[0] !== 429 || $e->retry_at > time())); }
}
$dir = sys_get_temp_dir() . '/ck-hcp-contract-' . bin2hex(random_bytes(5)); mkdir($dir, 0700);
$row = (object) array('request_id'=>'00000000-0000-4000-8000-000000000001', 'fingerprint'=>'test', 'kind'=>'ev',
    'payload'=>wp_json_encode(array('first'=>'CK TEST', 'email'=>'ck-form-test@example.invalid','phone'=>'2065550100','street'=>'123 Test Street','city'=>'Kirkland','state'=>'WA','zip'=>'98033')),'photos'=>'[]');
$posts = 0; $note = '';
$transport = function ($url, $args) use (&$posts, &$note) {
    $path = parse_url($url, PHP_URL_PATH);
    if ($path === '/company') { return ck_test_response(200, array('id'=>'b358b9df-b6fe-48d7-aa90-5a0f4a818848')); }
    if ($args['method'] === 'POST') {
        $posts++; $body = json_decode($args['body'], true);
        if ($path === '/customers') {
            ck_test_assert('test customer notifications disabled', $body['notifications_enabled'] === false && !isset($body['mobile_number']));
            return ck_test_response(201,array('id'=>'c1','notifications_enabled'=>false));
        }
        if ($path === '/estimates') {
            ck_test_assert('estimate unscheduled and unassigned', !isset($body['schedule']) && !isset($body['assigned_employee_ids']));
            return ck_test_response(201,array('id'=>'e1','customer'=>array('id'=>'c1'),'options'=>array(array('id'=>'o1'))));
        }
        $note = $body['content']; return ck_test_response(201,array('id'=>'n1','content'=>$note));
    }
    return ck_test_response(200,array('estimates'=>array(array('id'=>'e1','company_id'=>'b358b9df-b6fe-48d7-aa90-5a0f4a818848',
        'customer'=>array('id'=>'c1','notifications_enabled'=>false),'work_status'=>'needs scheduling','options'=>array(array('id'=>'o1','notes'=>array(array('id'=>'n1','content'=>$note))))))));
};
$client = new CK_HCP_Test_Client($key,$transport);
$r = new CK_HCP_Test_Runner($client,$row,$dir.'/success.json');
ck_test_assert('creation independently verified', $r->run()['status']==='verified');
$r = new CK_HCP_Test_Runner($client,$row,$dir.'/success.json');
ck_test_assert('repeat run creates no duplicates', $r->run()['status']==='verified' && $posts===3);
$formatted_row = clone $row;
$formatted_data = json_decode($formatted_row->payload, true);
$formatted_data['phone'] = '206-555-0100';
$formatted_row->payload = wp_json_encode($formatted_data);
$formatted_run = new CK_HCP_Test_Runner($client, $formatted_row, $dir.'/formatted-phone.json');
ck_test_assert('formatted synthetic phone retains test-only guard', $formatted_run->run()['status'] === 'verified' && strpos($note, 'TEST ONLY') !== false);
$journal=json_decode(file_get_contents($dir.'/success.json'),true);
$journal['steps']['estimate']=array('state'=>'unknown');
file_put_contents($dir.'/reconcile.json',wp_json_encode($journal));
$reconcile_client=new CK_HCP_Test_Client($key,function($url,$args) use ($transport,$row) {
    ck_test_assert('reconciliation is read-only',$args['method']==='GET');
    $response=$transport($url,$args);
    if(strpos($url,'/estimates?')!==false){
        $d=json_decode($response['body'],true);
        $d['estimates'][0]['options'][0]['name']='TEST ONLY — EV charger — '.$row->request_id;
        $response['body']=wp_json_encode($d);
    }
    return $response;
});
ck_test_assert('exact-marker estimate reconciliation',(new CK_HCP_Test_Runner($reconcile_client,$row,$dir.'/reconcile.json'))->reconcile_estimate()['status']==='reconciled');
foreach (array('timeout','missing-id','storage-failure') as $scenario) {
    $calls=0;
    $client=new CK_HCP_Test_Client($key,function($url,$args) use (&$calls,$scenario) {
        if ($args['method']==='GET') return ck_test_response(200,array('id'=>'b358b9df-b6fe-48d7-aa90-5a0f4a818848'));
        $calls++; return $scenario==='timeout' ? new WP_Error('timeout','Secret must never be surfaced') : ck_test_response(201,array('notifications_enabled'=>false));
    });
    $path=$dir.'/'.$scenario.'.json';
    for($i=0;$i<2;$i++) {
        try {
            $save=$scenario==='storage-failure' ? function(){throw new CK_HCP_Test_Error('journal_write_failed');} : null;
            (new CK_HCP_Test_Runner($client,$row,$path,$save))->run(); throw new RuntimeException('Expected stop');
        } catch(CK_HCP_Test_Error $e) {}
    }
    ck_test_assert($scenario.' does not duplicate a write', $calls===($scenario==='storage-failure'?0:1));
}
// Accepted attachments must remain pending until the API lists them on the estimate.
$photo_row = clone $row;
$photo_row->request_id = wp_generate_uuid4();
$photo_dir = CK_ESTIMATES_PRIVATE_DIR . '/' . $photo_row->request_id;
mkdir($photo_dir, 0700);
$photo_path = $photo_dir . '/panel.png';
file_put_contents($photo_path, base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII='));
$photo_row->photos = wp_json_encode(array(array('field'=>'panel','path'=>$photo_path,'mime'=>'image/png','sha256'=>hash_file('sha256',$photo_path))));
$uploaded=0; $visible=false;
$photo_transport = function ($url,$args) use ($transport,&$uploaded,&$visible,$photo_row) {
    if (strpos($url,'/attachments')!==false && $args['method']==='POST') { $uploaded++;return ck_test_response(202,array('accepted'=>true)); }
    $response=$transport($url,$args);
    if ($visible && $args['method']==='GET' && strpos($url,'/estimates?')!==false) {
        $body=json_decode($response['body'],true);
        $body['estimates'][0]['options'][0]['attachments']=array(array('id'=>'a1','file_name'=>'CK-TEST-'.$photo_row->request_id.'-panel.png'));
        $response['body']=wp_json_encode($body);
    }
    return $response;
};
$photo_client = new CK_HCP_Test_Client($key,$photo_transport);
$run=new CK_HCP_Test_Runner($photo_client,$photo_row,$dir.'/photo.json');
ck_test_assert('202 upload is not falsely marked verified',$run->run()['status']==='needs_verification');
$visible=true;
$run=new CK_HCP_Test_Runner($photo_client,$photo_row,$dir.'/photo.json');
ck_test_assert('delayed photo verified without duplicate upload',$run->run()['status']==='verified' && $uploaded===1);
unlink($photo_path);rmdir($photo_dir);
$real=clone $row;$real->payload=str_replace('CK TEST','Real Person',$real->payload);
try {new CK_HCP_Test_Runner($client,$real,$dir.'/real.json');throw new RuntimeException('Expected test-only gate');}
catch(CK_HCP_Test_Error $e){ck_test_assert('real submissions cannot be sent by test runner',$e->reason==='synthetic_test_records_only');}
foreach(glob($dir.'/*') as $file)unlink($file);rmdir($dir);
WP_CLI::success('Offline HCP contract tests passed. No network calls made.');
