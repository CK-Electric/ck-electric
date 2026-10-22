<?php
if (!defined('ABSPATH')) { exit; }
function ck_estimates_environment() {
    $host=wp_parse_url(home_url(),PHP_URL_HOST);
    if (defined('CK_ESTIMATES_LOCAL_MODE') && CK_ESTIMATES_LOCAL_MODE===true && in_array($host,array('ck-electric.local','ckelectric-1.local'),true)) { return 'local'; }
    if (defined('CK_ESTIMATES_STAGING_ENABLED') && CK_ESTIMATES_STAGING_ENABLED===true
        && wp_get_environment_type()==='staging'
        && $host==='stg-ckelectric-staging.kinsta.cloud'
        && wp_parse_url(home_url(),PHP_URL_SCHEME)==='https') { return 'staging'; }
    if (defined('CK_ESTIMATES_PRODUCTION_ENABLED') && CK_ESTIMATES_PRODUCTION_ENABLED===true
        && wp_get_environment_type()==='production'
        && $host==='ckelectric.kinsta.cloud') { return 'production'; }
    return 'disabled';
}
function ck_estimates_connection_token() {
    if (ck_estimates_environment()==='local') { return defined('CK_ESTIMATES_LOCAL_TOKEN') ? CK_ESTIMATES_LOCAL_TOKEN : ''; }
    if (ck_estimates_environment()==='staging') { return defined('CK_ESTIMATES_STAGING_TOKEN') ? CK_ESTIMATES_STAGING_TOKEN : ''; }
    if (ck_estimates_environment()==='production') { return defined('CK_ESTIMATES_PRODUCTION_TOKEN') ? CK_ESTIMATES_PRODUCTION_TOKEN : ''; }
    return '';
}
function ck_estimates_enabled() {
    $token=ck_estimates_connection_token();
    return ck_estimates_environment()!=='disabled' && is_string($token) && strlen($token)>=32 && defined('CK_ESTIMATES_PRIVATE_DIR');
}
