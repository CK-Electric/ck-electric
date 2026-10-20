import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
const hosts = new Set(['localhost', '127.0.0.1', '[::1]']);

async function forward(request: NextRequest, method: 'GET' | 'POST') {
  const base = process.env.CK_LOCAL_ESTIMATES_URL;
  const token = process.env.CK_LOCAL_ESTIMATES_TOKEN;
  if (process.env.NODE_ENV !== 'development' || !hosts.has(request.nextUrl.hostname)) {
    return NextResponse.json({ message: 'Not found.' }, { status: 404 });
  }
  const origin = request.headers.get('origin');
  if (method === 'POST' && origin !== request.nextUrl.origin) {
    return NextResponse.json({ message: 'Invalid request origin.' }, { status: 403 });
  }
  if (!base || !token || !['ck-electric.local', 'ckelectric-1.local'].includes(new URL(base).hostname)) {
    return NextResponse.json({ message: 'Local WordPress integration is not configured.' }, { status: 503 });
  }
  if (Number(request.headers.get('content-length') || 0) > 32 * 1024 * 1024) {
    return NextResponse.json({ message: 'Please keep the total upload under 30 MB.' }, { status: 413 });
  }
  try {
    const body = method === 'POST' ? await request.formData() : undefined;
    if (body) {
      let bytes = 0;
      for (const value of body.values()) bytes += typeof value === 'string' ? value.length : value.size;
      if (bytes > 31 * 1024 * 1024) return NextResponse.json({ message: 'Upload too large.' }, { status: 413 });
    }
    const endpoint = new URL('/index.php', base);
    endpoint.searchParams.set('rest_route', `/ck-estimates/v1/${method === 'GET' ? 'limits' : 'requests'}`);
    const response = await fetch(endpoint, {
      method, headers: { Authorization: `Bearer ${token}` }, body,
      cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(45_000),
    });
    const result = await response.json();
    return NextResponse.json(result, { status: response.status, headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ message: 'Could not confirm the WordPress response. Keep your answers and retry; the same request reference will prevent duplicates.' }, { status: 503 });
  }
}
export function GET(request: NextRequest) { return forward(request, 'GET'); }
export function POST(request: NextRequest) { return forward(request, 'POST'); }
