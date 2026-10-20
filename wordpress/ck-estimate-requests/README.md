# Local estimate backend

This is a **development-only** WordPress plugin. It saves real local records and
private photo files, then processes them with a mock CRM adapter. It contains no
Housecall Pro HTTP client, email sender, or notification integration. It is not a
production-ready plugin and cannot be enabled merely by installing it in production.

## Architecture

Browser → development-only Next.js `/api/local-estimates` → authenticated local
WordPress REST endpoint → database + private files → mock CRM result.

The local Next.js relay avoids browser CORS configuration and keeps the connection
token server-side. Production upload routing and hosting limits remain to be designed
and verified before deployment. Existing hosted lead forms are unchanged.

## Local installation currently in use

- WordPress: `http://ckelectric-1.local` (refreshed from production)
- Plugin: DevKinsta `public/ckelectric-1/wp-content/plugins/ck-estimate-requests/`
- Local configuration: `public/ckelectric-1/wp-content/mu-plugins/ck-local-estimate-config.php`
- Database table: WordPress prefix + `ck_estimate_requests`
- Private photos: DevKinsta `private/ckelectric-1-estimates/<request UUID>/`
- Next.js configuration: ignored `client/.env.local` variables
  `CK_LOCAL_ESTIMATES_URL` and `CK_LOCAL_ESTIMATES_TOKEN` (never `NEXT_PUBLIC_*`).

The local configuration defines `CK_ESTIMATES_LOCAL_MODE=true`, a random shared
`CK_ESTIMATES_LOCAL_TOKEN`, and `CK_ESTIMATES_PRIVATE_DIR` outside the site's web
root. The plugin also requires WordPress's configured hostname to be one of the explicitly allowed local sites. Configuration and private files must not be deployed to Kinsta.

The source in this folder is copied into DevKinsta; it is not automatically synced.
After source edits, copy the plugin PHP file to the local plugin folder. Activation
creates the table. Do not copy WordPress core, databases, or local secrets into git.

## Manual testing

Open the EV or panel form at localhost:3000/request-estimate/ev-charger or
localhost:3000/request-estimate/panel-replacement. Use synthetic contact details.

1. Complete the project questions and required photos/visit preferences.
2. Enter contact details and submit. Confirmation means the request is saved locally.
3. The presentation UI has no debugging controls. Use the integration test below
   to exercise simulated failures and retries.
4. Retrying the same request ID completes the existing record, increments its
   attempts counter, and creates no duplicate row/photo folder.
5. Editing answers or photos creates a new request identifier. A successful identical
   resubmission returns the original receipt without reprocessing.

The browser reads actual PHP upload limits. Effective limits are at most 15 MB per
file, 30 MB total, and 18 files, reduced if PHP configuration is stricter. File content
is inspected server-side; HEIC support depends on server MIME detection. No image
compression or format conversion is implemented yet.

## Verification

With Next.js and DevKinsta running:

```sh
python3 wordpress/ck-estimate-requests/tests/local-smoke.py
```

Tests create synthetic records locally, including photo uploads, failure/retry,
duplicate prevention, invalid fields/images, and disallowed browser origins.
No live CRM calls or email are made. Tests intentionally leave records for inspection.

Inspect summary records without an admin screen:

```sh
docker exec devkinsta_fpm wp --allow-root --path=/www/kinsta/public/ckelectric-1 db query \
  'SELECT request_id,kind,status,attempts,created_at FROM wp_ck_estimate_requests ORDER BY created_at DESC LIMIT 20;'
```

Use the table's `payload`, `photos`, and `result` columns for deeper local debugging.
Photo paths are never returned to the browser and are not WordPress media attachments.
There is no public listing or download endpoint.

## Boundaries / remaining production work

### Personal mirror review

Netlify builds linked to `https://github.com/erikaaquino/ck-electric2` expose
`/request-estimate/ev-charger` and `/request-estimate/panel-replacement` as UI demos.
The build checks Netlify's `REPOSITORY_URL`; other production builds keep these
routes unavailable. Demo answers and photos stay in browser memory, and the final
screen explicitly confirms that nothing was submitted or saved. The local API
remains unavailable in production. No WordPress credentials or Housecall Pro key
are needed for this review mode.

### Before live submissions

- No admin dashboard, automatic retry worker, office alerting, or live API adapter.
- Records and photos persist locally until deliberately cleaned up; there is no
  automatic retention cleanup yet. Refreshing clears unsaved browser state only.
- A saved failed request can be retried through the current browser session. Resuming
  after refresh and recovery after process interruption need a future recovery flow.
- Concurrent retries are serialized by a MySQL advisory lock and the request UUID is
  a database primary key. Fingerprints prevent reusing an ID with different content.
- Mock processing is synchronous. Production needs durable staged processing and
  reconciliation for uncertain CRM results before retrying record creation.
- Production requires API access verification, real endpoint contracts, spam/rate
  controls, retention/recovery, delivery monitoring, and hosting upload tests.
- Pulling another WordPress database into DevKinsta can replace local test records
  or plugin activation state. Preserve any needed local tests first.
