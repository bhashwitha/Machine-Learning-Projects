import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Check for role-based access
    if (path.startsWith('/api/admin') && token?.role !== 'admin') {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    // Department-specific access
    if (path.startsWith('/api/departments') && !token?.department) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
);

export const config = {
  matcher: [
    '/api/:path*',
    '/patients/:path*',
    '/dashboard/:path*'
  ]
}; 