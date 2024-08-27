import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('pb_auth')?.value
  const path = request.nextUrl.pathname

  // List of paths that should be accessible without authentication
  const publicPaths = [
    '/user/signup',
    '/user/login',
    '/merchant/signup',
    '/merchant/login'
  ]

  // If the path is in the publicPaths list, allow access
  if (publicPaths.includes(path)) {
    return NextResponse.next()
  }

  // For all other paths under /user or /merchant, check for authentication
  if (path.startsWith('/user/') || path.startsWith('/merchant/')) {
    if (!authToken) {
      // Redirect to home page if not authenticated
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // For all other routes, allow access
  return NextResponse.next()
}

export const config = {
  matcher: ['/user/:path*', '/merchant/:path*']
}