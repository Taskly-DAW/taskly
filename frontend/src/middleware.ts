import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  const signInUrl = new URL('/login', request.url);
  const signUpUrl = new URL('/register', request.url);
  const dashboardUrl = new URL('/', request.url);

  const isLoginPage = request.nextUrl.pathname === '/login';
  const isRegisterPage = request.nextUrl.pathname === '/register';
  const isPublicPage = isLoginPage || isRegisterPage;

  if (!token && !isPublicPage) {
    return NextResponse.redirect(signInUrl);
  }

  if (token && isPublicPage) {
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};