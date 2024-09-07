import { NextResponse } from 'next/server';

export function middleware(request) {
  const authToken = request.cookies.get('pb_auth')?.value;
  const path = request.nextUrl.pathname.split('?')[0];

  // Log for debugging
  console.log('Middleware called for path:', path);
  console.log('Auth token:', authToken);

  const publicPaths = ['/user/signup', '/user/offers', '/user/callback', '/user/login', '/merchant/signup', '/merchant/login'];

  // Public path access check
  if (publicPaths.includes(path)) {
    console.log(`Path "${path}" is public, allowing access.`);
    return NextResponse.next();
  }

  // Authenticated paths check
  if (path.startsWith('/user/') || path.startsWith('/merchant/')) {
    if (!authToken) {
      console.log('No auth token found, redirecting to home');
      return NextResponse.redirect(new URL('/', request.url));
    } else {
      console.log('Auth token found, allowing access.');
    }
  }

  // Allow access for all other paths
  return NextResponse.next();
}
