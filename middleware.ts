import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // #region agent log
  await fetch('http://127.0.0.1:7244/ingest/01262c0e-039b-4c47-911b-42e92762b72a', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: 'middleware.ts:14',
      message: 'Incoming request',
      data: { pathname },
      timestamp: Date.now(),
      sessionId: 'debug-session',
      hypothesisId: 'A'
    })
  }).catch(() => {});
  // #endregion

  // Wenn es die Studio-Route ist, ignorieren wir die Internationalisierung
  if (pathname.startsWith('/studio') || pathname.startsWith('/studio-test')) {
    // #region agent log
    await fetch('http://127.0.0.1:7244/ingest/01262c0e-039b-4c47-911b-42e92762b72a', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'middleware.ts:32',
        message: 'Bypassing i18n for studio - returning NextResponse.next()',
        data: { pathname },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        hypothesisId: 'E'
      })
    }).catch(() => {});
    // #endregion
    return NextResponse.next();
  }

  const response = await intlMiddleware(request);

  // #region agent log
  await fetch('http://127.0.0.1:7244/ingest/01262c0e-039b-4c47-911b-42e92762b72a', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: 'middleware.ts:50',
      message: 'Response from intlMiddleware',
      data: { pathname, status: response?.status, locationHeader: response?.headers.get('location') },
      timestamp: Date.now(),
      sessionId: 'debug-session',
      hypothesisId: 'A'
    })
  }).catch(() => {});
  // #endregion

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
