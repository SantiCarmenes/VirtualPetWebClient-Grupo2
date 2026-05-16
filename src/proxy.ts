import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas que requieren sesión activa
const PROTECTED_ROUTES = ['/checkout', '/orders', '/profile'];

// Rutas de auth que redirigen si ya hay sesión
const AUTH_ROUTES = ['/login', '/register', '/forgot-password'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // El access_token viaja como HttpOnly Cookie → el middleware puede leerla.
  // Si la cookie existe → hay sesión (o el token expiró, pero fetchApi lo
  // maneja con refresh automático del lado del cliente).
  const hasSession = request.cookies.has('access_token');

  // ── Rutas protegidas: redirigir a /login si no hay sesión ──
  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtected && !hasSession) {
    const loginUrl = new URL('/login', request.url);
    // Guardar la URL original para redirigir de vuelta después del login (opcional)
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Rutas de auth: redirigir a /catalog si ya hay sesión ──
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route);

  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL('/catalog', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/checkout',
    '/orders/:path*',
    '/profile',
    '/login',
    '/register',
    '/forgot-password',
  ],
};
