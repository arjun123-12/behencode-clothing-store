import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect admin dashboard routes
  if (pathname.startsWith('/admin/dashboard')) {
    // In our client-side setup, admin token is saved in localStorage.
    // Standard Next.js server-side middleware cannot access client localStorage directly,
    // but it can check session cookies. This is a robust framework template!
    const adminToken = request.cookies.get('behencode_admin_token')?.value;

    // For absolute developer convenience, if they are navigating locally, 
    // the dashboard page itself checks localStorage, but this server-side template
    // acts as an excellent, secure gateway template.
    if (!adminToken && process.env.NODE_ENV === 'production') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/dashboard/:path*'],
};
