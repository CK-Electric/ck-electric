import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
const hosts = new Set(['localhost', '127.0.0.1', '[::1]']);

async function forward(request: NextRequest, method: 'GET' | 'POST') {
  const stagingHost = 'ck-electric-forms-staging.netlify.app';
  const productionHost = 'ckelectricllp.com';
  const staging = process.env.CK_FORMS_STAGING === 'true' &&
    request.nextUrl.hostname === stagingHost;
  const production = process.env.CK_FORMS_PRODUCTION === 'true' &&
    request.nextUrl.hostname === productionHost;
  const local = process.env.NODE_ENV === 'development' && hosts.has(request.nextUrl.hostname);
  const base = staging ? 'https://stg-ckelectric-staging.kinsta.cloud' : production ? 'https://ckelectric.kinsta.cloud' : process.env.CK_LOCAL_ESTIMATES_URL;
  const token = staging ? process.env.CK_STAGING_ESTIMATES_TOKEN : production ? process.env.CK_PRODUCTION_ESTIMATES_TOKEN : process.env.CK_LOCAL_ESTIMATES_TOKEN;
  if (!local && !staging && !production) {
    return NextResponse.json({ message: 'Not found.' }, { status: 404 });
  }
  const origin = request.headers.get('origin');
  const expectedOrigin = staging ? `https://${stagingHost}` : production ? `https://${productionHost}` : request.nextUrl.origin;
  if (method === 'POST' && origin !== expectedOrigin) {
    return NextResponse.json({ message: 'Invalid request origin.' }, { status: 403 });
  }
  let validBase = false;
  try {
    const baseUrl = base ? new URL(base) : null;
    validBase = !!baseUrl && (staging
      ? baseUrl.origin === 'https://stg-ckelectric-staging.kinsta.cloud'
      : production ? baseUrl.origin === 'https://ckelectric.kinsta.cloud'
      : ['ck-electric.local', 'ckelectric-1.local'].includes(baseUrl.hostname));
  } catch { /* Invalid configuration fails closed. */ }
  if (!validBase || !base || !token) {
    return NextResponse.json({ message: 'Local WordPress integration is not configured.' }, { status: 503 });
  }
  const hosted = staging || production;
  const maxBytes = (hosted ? 4 : 30) * 1024 * 1024;
  if (Number(request.headers.get('content-length') || 0) > maxBytes + 64 * 1024) {
    return NextResponse.json({ message: `Please keep the total upload under ${hosted ? 4 : 30} MB.` }, { status: 413 });
  }
  try {
    const body = method === 'POST' ? await request.formData() : undefined;
    if (body) {
      let bytes = 0;
      for (const value of body.values()) bytes += typeof value === 'string' ? value.length : value.size;
      if (bytes > maxBytes + 32 * 1024) return NextResponse.json({ message: 'Upload too large.' }, { status: 413 });
    }
    const endpoint = new URL('/index.php', base);
    endpoint.searchParams.set('rest_route', `/ck-estimates/v1/${method === 'GET' ? 'limits' : 'requests'}`);
    const response = await fetch(endpoint, {
      method, headers: { Authorization: `Bearer ${token}` }, body,
      cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(55_000),
    });
    const result = await response.json();
    if (method === 'GET' && hosted && response.ok) {
      result.file_bytes = Math.min(result.file_bytes, maxBytes);
      result.total_bytes = Math.min(result.total_bytes, maxBytes);
    }
    return NextResponse.json(result, { status: response.status, headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ message: 'Something went wrong, and we couldn’t confirm your form was sent. Your answers are still here—please try again.' }, { status: 503 });
  }
}
export function GET(request: NextRequest) { return forward(request, 'GET'); }
export function POST(request: NextRequest) { return forward(request, 'POST'); }
