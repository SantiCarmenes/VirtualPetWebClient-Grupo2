import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/orders', '/profile'];
const AUTH_ROUTES = ['/login', '/register', '/forgot-password'];

// Cookie seteada por el cliente (mismo dominio Vercel) al hacer login/logout.
// No contiene el token real — solo indica si hay sesión activa.
// El acceso real a la API siempre requiere Bearer token válido.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has('has_session');

  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtected && !hasSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route);
  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL('/catalog', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/orders/:path*',
    '/profile',
    '/login',
    '/register',
    '/forgot-password',
  ],
};
