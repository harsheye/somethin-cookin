import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check cookies first
  const token = request.cookies.get('token')?.value;
  const userRole = request.cookies.get('userRole')?.value;

  // Protected farmer routes
  if (request.nextUrl.pathname.startsWith('/farmer-dashboard')) {
    if (!token || userRole !== 'farmer') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/farmer-dashboard/:path*']
}; 