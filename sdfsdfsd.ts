/**
 * Middleware de Next.js para proteger rutas privadas
 * Verifica autenticación antes de permitir acceso a rutas protegidas
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas que requieren autenticación
const protectedRoutes = ['/dashboard'];

// Rutas que solo son accesibles si NO estás autenticado (redirigir si ya estás logueado)
const authRoutes = ['/login'];

// Rutas públicas (siempre accesibles)
const publicRoutes = ['/', '/api'];

/**
 * Verificar si una ruta está protegida
 */
function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some((route) => pathname.startsWith(route));
}

/**
 * Verificar si una ruta es de autenticación (login, registro, etc.)
 */
function isAuthRoute(pathname: string): boolean {
  return authRoutes.some((route) => pathname === route);
}

/**
 * Verificar si una ruta es pública
 */
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => pathname === route || pathname.startsWith(route));
}

/**
 * Verificar si hay una cookie de sesión (Laravel Sanctum)
 * Nota: En middleware de Next.js no podemos leer cookies HTTP-only directamente
 * Por eso verificamos la presencia de la cookie de sesión de Laravel
 */
function hasSessionCookie(request: NextRequest): boolean {
  const sessionCookie = request.cookies.get('laravel_session');
  const sanctumCookie = request.cookies.get('XSRF-TOKEN');
  
  // Si existe alguna cookie de sesión, asumimos que el usuario puede estar autenticado
  // La verificación real se hace en el lado del cliente
  return !!sessionCookie || !!sanctumCookie;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir rutas públicas
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Si es ruta protegida
  if (isProtectedRoute(pathname)) {
    const hasSession = hasSessionCookie(request);

    // Si no tiene cookie de sesión, redirigir al login
    if (!hasSession) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Si tiene cookie, permitir acceso (la verificación real se hace en el cliente)
    return NextResponse.next();
  }

  // Si es ruta de autenticación (login) y ya tiene sesión, redirigir al dashboard
  if (isAuthRoute(pathname)) {
    const hasSession = hasSessionCookie(request);
    
    if (hasSession) {
      const redirectTo = request.nextUrl.searchParams.get('redirect') || '/dashboard';
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
  }

  // Por defecto, permitir acceso
  return NextResponse.next();
}

/**
 * Configuración de matcher para el middleware
 * Define en qué rutas se ejecutará el middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

