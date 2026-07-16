import { NextResponse, type NextRequest } from 'next/server';

const protectedPrefix = '/admin';
const loginPath = '/admin/login';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith(protectedPrefix) || pathname === loginPath) {
    return NextResponse.next();
  }

  const hasAccess = request.cookies.has('idesign_admin_access');
  const hasRefresh = request.cookies.has('idesign_admin_refresh');

  if (!hasAccess && !hasRefresh) {
    const url = request.nextUrl.clone();
    url.pathname = loginPath;
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
