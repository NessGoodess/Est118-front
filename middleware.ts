/**
 * Next.js Middleware
 * Middleware of Next.js to handle route protection and redirection based on authentication status.
 * Verifies authentication before allowing access to protected routes
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard'];
const authRoutes = ['/login'];

function isProtected(pathname: string) {
  return protectedRoutes.some(route => pathname.startsWith(route));
}

function isAuth(pathname: string) {
  return authRoutes.includes(pathname);
}

function hasAuthCookie(req: NextRequest) {
  const session = req.cookies.get('est118_session');
  const xsrf = req.cookies.get('XSRF-TOKEN');
  return !!session;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLoggedIn = hasAuthCookie(req);

  if (isProtected(pathname) && !isLoggedIn) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuth(pathname) && isLoggedIn) {
    const redirectTo = req.nextUrl.searchParams.get('redirect');
    return NextResponse.redirect(
      new URL(redirectTo && redirectTo !== '/login' ? redirectTo : '/dashboard', req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
