import { NextResponse } from 'next/server';

import { useAuth } from '@/lib/useAuth'; // Import the useAuth hook

export function middleware(request) {
  
  const authToken = request.cookies.get('pb_auth')?.value;
  const path = request.nextUrl.pathname;

  // Log for debugging
  console.log('Middleware called for path:', path);
  console.log('Auth token:', authToken);

  // List of paths that should be accessible without authentication
  const publicPaths = ['/user/signup', '/user/login', '/merchant/signup', '/merchant/login'];

  // If the path is in the publicPaths list, allow access
  console.log(path)
  if (publicPaths.includes(path)) {
    return NextResponse.next();
  }

  // For all other paths under /user or /merchant, check for authentication
  if (path.startsWith('/user/') || path.startsWith('/merchant/')) {
    if (!authToken) {
      // Redirect to home page if not authenticated
      console.log('No auth token found, redirecting to home');
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // For all other routes, allow access
  return NextResponse.next();
}

// export const config = {
//   matcher: ['/user/:path*', '/merchant/:path*'],
// };