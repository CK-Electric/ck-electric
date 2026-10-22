<?php
// Standalone PHP: one fresh process per case, without WordPress or any network.
define('ABSPATH', '/offline/');
$case=$argv[1];$url='https://stg-ckelectric-staging.kinsta.cloud';$env='staging';
if ($case==='wrong-host') {$url='https://ck-electric.com';}
if ($case==='wrong-environment') {$env='production';}
if ($case==='http') {$url='http://stg-ckelectric-staging.kinsta.cloud';}
if ($case==='local') {$url='http://ckelectric-1.local';define('CK_ESTIMATES_LOCAL_MODE',true);define('CK_ESTIMATES_LOCAL_TOKEN',str_repeat('l',32));}
if ($case==='production') {$url='http://ckelectric.kinsta.cloud';$env='production';define('CK_ESTIMATES_PRODUCTION_ENABLED',true);define('CK_ESTIMATES_PRODUCTION_TOKEN',str_repeat('p',32));}
if ($case==='production-wrong-host') {$url='http://other.kinsta.cloud';$env='production';define('CK_ESTIMATES_PRODUCTION_ENABLED',true);define('CK_ESTIMATES_PRODUCTION_TOKEN',str_repeat('p',32));}
if ($case==='production-wrong-environment') {$url='http://ckelectric.kinsta.cloud';$env='staging';define('CK_ESTIMATES_PRODUCTION_ENABLED',true);define('CK_ESTIMATES_PRODUCTION_TOKEN',str_repeat('p',32));}
if ($case==='production-off') {$url='http://ckelectric.kinsta.cloud';$env='production';define('CK_ESTIMATES_PRODUCTION_ENABLED',false);define('CK_ESTIMATES_PRODUCTION_TOKEN',str_repeat('p',32));}
if ($case!=='off') {define('CK_ESTIMATES_STAGING_ENABLED',true);}
define('CK_ESTIMATES_STAGING_TOKEN',$case==='short-token'?'short':str_repeat('s',32));
define('CK_ESTIMATES_PRIVATE_DIR','/private/offline');
function home_url() {global $url;return $url;}
function wp_parse_url($url,$component) {return parse_url($url,$component);}
function wp_get_environment_type() {global $env;return $env;}
require dirname(__DIR__).'/includes/environment.php';
$expected=in_array($case,array('staging','local','production'),true);
if (ck_estimates_enabled()!==$expected) {throw new RuntimeException('Failed '.$case);}
if ($case==='local' && ck_estimates_connection_token()!==str_repeat('l',32)) {throw new RuntimeException('Wrong local token');}
if ($case==='production' && ck_estimates_connection_token()!==str_repeat('p',32)) {throw new RuntimeException('Wrong production token');}
echo 'PASS: '.$case.PHP_EOL;
