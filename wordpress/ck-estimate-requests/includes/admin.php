<?php
if (!defined('ABSPATH')) { exit; }
require_once __DIR__ . '/format.php';
function ck_estimates_admin_guard() {
    if (!ck_estimates_enabled() || !current_user_can('manage_options')) { wp_die('Access denied.', '', array('response' => 403)); }
}
add_action('admin_menu', function () {
    if (ck_estimates_enabled()) { add_menu_page('Estimate Requests', 'Estimate Requests', 'manage_options', 'ck-estimates', 'ck_estimates_admin_page', 'dashicons-clipboard', 26); }
});
function ck_estimates_admin_page() {
    ck_estimates_admin_guard(); global $wpdb; $table = ck_estimates_table();
    $id = sanitize_text_field(wp_unslash($_GET['request'] ?? ''));
    $notice = ck_estimates_delivery_mode() === 'hcp'
        ? '<strong>Housecall Pro delivery is enabled.</strong> Each request shows its delivery status and verification steps.'
        : '<strong>Simulation mode.</strong> Requests are saved for review but are not sent to Housecall Pro.';
    echo '<div class="wrap"><h1>Estimate Requests</h1><div class="notice notice-info"><p>' . wp_kses_post($notice) . '</p></div>';
    if ($id) {
        $row = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table WHERE request_id = %s", $id));
        if (!$row) { echo '<p>Request not found.</p></div>'; return; }
        echo '<p><a href="' . esc_url(admin_url('admin.php?page=ck-estimates')) . '">← All requests</a></p><h2>' . esc_html($row->kind === 'ev' ? 'EV charger' : 'Panel replacement') . '</h2>';
        echo '<p>Reference: <code>' . esc_html($row->request_id) . '</code></p><p>Status: <strong>' . esc_html(str_replace('_', ' ', $row->status)) . '</strong> · Attempts: ' . (int) $row->attempts . '</p>';
        $result = json_decode($row->result, true) ?: array();
        echo '<p>' . esc_html($result['message'] ?? 'Request saved. Delivery status is being checked.') . '</p>';
        echo '<p>Delivery: <strong>' . esc_html(($result['adapter'] ?? 'mock') === 'hcp' ? 'Housecall Pro' : 'Local simulation') . '</strong></p>';
        if (!empty($result['error'])) { echo '<p>Issue: <code>' . esc_html($result['error']) . '</code></p>'; }
        $estimate = $result['journal']['steps']['estimate']['result'] ?? array();
        if (!empty($estimate['number'])) { echo '<p>Housecall Pro estimate: <strong>#' . esc_html($estimate['number']) . '</strong></p>'; }
        if ($row->available_at && $row->status === 'needs_attention') { echo '<p>Safe retry available after: ' . esc_html($row->available_at) . ' UTC</p>'; }
        if (!empty($result['journal']['steps'])) {
            echo '<h2>Delivery steps</h2><ul>';
            foreach ($result['journal']['steps'] as $step => $details) {
                echo '<li><strong>' . esc_html(ucfirst(str_replace('_',' ',$step))) . ':</strong> ' . esc_html(str_replace('_',' ',$details['state'] ?? 'pending')) . '</li>';
            }
            echo '</ul><p>Photos accepted by Housecall Pro are confirmed separately before the request is marked completed.</p>';
        }
        if (!empty($result['retried_by'])) { echo '<p>Last retry by user #' . (int) $result['retried_by'] . ' at ' . esc_html($result['retried_at'] ?? '') . ' UTC.</p>'; }
        if ($row->status === 'needs_attention' && ck_estimates_retryable($result)) {
            echo '<form method="post" action="' . esc_url(admin_url('admin-post.php')) . '"><input type="hidden" name="action" value="ck_estimates_retry"><input type="hidden" name="request" value="' . esc_attr($id) . '">';
            wp_nonce_field('ck-estimates-retry-' . $id); submit_button(($result['adapter'] ?? 'mock') === 'mock' ? 'Retry local simulation' : 'Retry safe unfinished steps', 'secondary'); echo '</form>';
        }
        echo '<h2>Customer answers</h2><table class="widefat striped"><tbody>';
        foreach (ck_estimates_readable_answers(json_decode($row->payload, true) ?: array()) as $key => $value) {
            echo '<tr><th scope="row" style="width:220px">' . esc_html(ucfirst(str_replace(array('_', '-'), ' ', $key))) . '</th><td>' . nl2br(esc_html($value)) . '</td></tr>';
        }
        echo '</tbody></table><h2>Private photos</h2><ul>';
        foreach ((json_decode($row->photos, true) ?: array()) as $index => $photo) {
            $url = wp_nonce_url(add_query_arg(array('action' => 'ck_estimates_photo', 'request' => $id, 'photo' => $index), admin_url('admin-post.php')), 'ck-estimates-photo-' . $id . '-' . $index);
            echo '<li><a href="' . esc_url($url) . '">Download ' . esc_html($photo['field'] . ' — ' . $photo['name']) . '</a></li>';
        }
        echo '</ul></div>'; return;
    }
    $page = max(1, absint($_GET['paged'] ?? 1)); $offset = ($page - 1) * 25;
    $rows = $wpdb->get_results($wpdb->prepare("SELECT request_id, kind, status, attempts, created_at FROM $table ORDER BY created_at DESC LIMIT 25 OFFSET %d", $offset));
    echo '<p>Open a request to review its answers, photos and processing status. Times are UTC.</p><table class="widefat striped"><thead><tr><th>Reference</th><th>Form</th><th>Status</th><th>Attempts</th><th>Received</th></tr></thead><tbody>';
    foreach ($rows as $row) {
        echo '<tr><td><a href="' . esc_url(add_query_arg(array('page' => 'ck-estimates', 'request' => $row->request_id), admin_url('admin.php'))) . '">' . esc_html($row->request_id) . '</a></td><td>' . esc_html($row->kind === 'ev' ? 'EV charger' : 'Panel replacement') . '</td><td>' . esc_html(ucfirst(str_replace('_', ' ', $row->status))) . '</td><td>' . (int) $row->attempts . '</td><td>' . esc_html($row->created_at) . '</td></tr>';
    }
    if (!$rows) { echo '<tr><td colspan="5">No requests yet.</td></tr>'; }
    echo '</tbody></table>';
    echo wp_kses_post(paginate_links(array('base' => add_query_arg('paged', '%#%'), 'total' => max(1, ceil((int) $wpdb->get_var("SELECT COUNT(*) FROM $table") / 25)), 'current' => $page)));
    echo '</div>';
}
add_action('admin_post_ck_estimates_retry', function () {
    ck_estimates_admin_guard();
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') { wp_die('POST required.', '', array('response' => 405)); }
    $id = sanitize_text_field(wp_unslash($_POST['request'] ?? '')); check_admin_referer('ck-estimates-retry-' . $id);
    $retry = ck_estimates_retry($id);
    if (is_wp_error($retry)) { wp_die(esc_html($retry->get_error_message()), '', array('response'=>409)); }
    wp_safe_redirect(add_query_arg(array('page' => 'ck-estimates', 'request' => $id), admin_url('admin.php'))); exit;
});
add_action('admin_post_ck_estimates_photo', function () {
    ck_estimates_admin_guard();
    $id = sanitize_text_field(wp_unslash($_GET['request'] ?? '')); $index = absint($_GET['photo'] ?? 0);
    check_admin_referer('ck-estimates-photo-' . $id . '-' . $index);
    $path = ck_estimates_private_photo($id, $index);
    if (is_wp_error($path)) { wp_die('Photo unavailable.', '', array('response' => 404)); }
    nocache_headers(); header('X-Content-Type-Options: nosniff'); header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . sanitize_file_name(basename($path)) . '"'); header('Content-Length: ' . filesize($path)); readfile($path); exit;
});

function ck_estimates_private_photo($id, $index) {
    ck_estimates_admin_guard();
    if (!is_string($id) || !preg_match('/^[a-f0-9-]{36}$/', $id)) { return new WP_Error('photo_unavailable','Photo unavailable.'); }
    global $wpdb; $table = ck_estimates_table();
    $manifest = json_decode($wpdb->get_var($wpdb->prepare("SELECT photos FROM $table WHERE request_id = %s", $id)) ?: '[]', true);
    $photo = $manifest[$index] ?? null; $root = realpath(CK_ESTIMATES_PRIVATE_DIR); $path = $photo ? realpath($photo['path']) : false;
    if (!$root || !$path || strpos($path, $root . '/' . $id . '/') !== 0 || !is_file($path) || !is_readable($path) || !hash_equals($photo['sha256'], hash_file('sha256', $path))) { return new WP_Error('photo_unavailable','Photo unavailable.'); }
    return $path;
}
