/**
 * Soft UX gate for private routes.
 *
 * Axios + AuthContext/PrivateGuard own real session validity (API 401 →
 * SESSION_EXPIRED). This middleware only checks cookie *presence* on the
 * Next.js host to avoid a flash of private UI before hydration.
 *
 * Keep it when frontend and API share a host (same IP/hostname, different
 * ports) or a parent SESSION_DOMAIN so `laravel-session` is visible here.
 * If the cookie is host-only on the API origin, this check is always false
 * and PrivateGuard alone protects the UI — middleware then adds little value.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** Route prefixes that require a session cookie hint */
const protectedPrefixes = [
  '/dashboard',
  '/users',
  '/admissions',
  '/students',
  '/attendance',
  '/general-attendance',
  '/asistencia-general',
  '/groups',
  '/profile',
  '/re-enrollment',
  '/academic-years',
  '/Announcement',
  '/Announcements',
  '/gestion-de-credenciales',
  '/pruebas',
];

const authRoutes = ['/login'];

/** Must match Laravel SESSION_COOKIE (APP_NAME slug + -session) */
const SESSION_COOKIE = 'est118-session';

function isProtected(pathname: string) {
  return protectedPrefixes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

function isAuthRoute(pathname: string) {
  return authRoutes.some((route) => pathname.startsWith(route));
}

function hasSessionCookie(req: NextRequest) {
  return !!req.cookies.get(SESSION_COOKIE);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const loggedInHint = hasSessionCookie(req);

  if (isProtected(pathname) && !loggedInHint) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute(pathname) && loggedInHint) {
    const redirectTo = req.nextUrl.searchParams.get('redirect');
    return NextResponse.redirect(
      new URL(
        redirectTo && redirectTo !== '/login' ? redirectTo : '/dashboard',
        req.url
      )
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
