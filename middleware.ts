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

function isAuthRoute(pathname: string) {
  return authRoutes.some(route => pathname.startsWith(route));
}

function isLoggedIn(req: NextRequest) {
  // ✅ TU cookie REAL de sesión
  return !!req.cookies.get('est118-session');
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const loggedIn = isLoggedIn(req);

  // 🔒 Rutas protegidas sin sesión
  if (isProtected(pathname) && !loggedIn) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 🔁 Usuario logueado intentando ir a /login
  if (isAuthRoute(pathname) && loggedIn) {
    const redirectTo = req.nextUrl.searchParams.get('redirect');

    return NextResponse.redirect(
      new URL(
        redirectTo && redirectTo !== '/login'
          ? redirectTo
          : '/dashboard',
        req.url
      )
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
