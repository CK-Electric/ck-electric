# CK Estimate Requests

Custom WordPress plugin for receiving estimate requests from the CK Electric
website. It validates request fields and uploaded photos, saves them before
processing, and provides an administrator-only screen for reviewing delivery
status and safely retrying eligible failures.

## Runtime contents

The plugin runtime consists of `ck-estimate-requests.php` and the PHP files in
`includes/`. Keep the `tests/` directory out of the installable plugin package.
Installing this plugin does not configure credentials or enable public delivery.

## Configuration and security

Configure each environment separately in server-side WordPress configuration.
The plugin requires an explicitly enabled environment, a private connection
token, and a writable private storage directory outside the public web root.
Housecall Pro delivery is controlled separately. Store its API key in a
restricted file outside the web root and configure only the file path on the
server. Never commit credentials or expose them through browser-visible
environment variables.

The plugin fails closed when the site host, WordPress environment, or required
server configuration does not match. The WordPress admin screen requires the
administrator capability. Private photo downloads use authenticated admin
actions and request-specific nonces.

## Processing behavior

Requests and photos are saved before processing. Normal form submissions are
processed synchronously; they do not require a scheduled worker. The plugin
records delivery steps and verifies Housecall Pro records before marking a
request complete. Uncertain outcomes require review instead of automatic
replay. Eligible retries are available to administrators after a cooldown.

## Tests

The `tests/` directory contains offline contract tests and WordPress-backed
checks. Run those only in an isolated test WordPress environment; never run
write-capable tests against a live site.

PHP syntax can be checked with `php -l` on the plugin files. End-to-end
verification must use a controlled staging environment and synthetic request
data.
