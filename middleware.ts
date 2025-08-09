import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
    
    // Redirect authenticated users away from auth pages
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    
    // Additional middleware logic can be added here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Always allow access to auth-related routes and API routes
        if (req.nextUrl.pathname.startsWith('/api/auth')) return true
        if (req.nextUrl.pathname.startsWith('/auth')) return true
        
        // Allow diagnostic endpoints without authentication
        if (req.nextUrl.pathname.startsWith('/api/diagnostic')) return true
        if (req.nextUrl.pathname.startsWith('/api/debug-')) return true
        
        // Allow unauthenticated access only to the home page
        if (req.nextUrl.pathname === '/') return true
        
        // For all other routes, require authentication
        if (!token) return false
        
        // Require admin role for admin routes
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token.role === 'ADMIN'
        }
        
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (Next Auth API routes)
     * - api/diagnostic (Diagnostic endpoint)
     * - api/debug- (Debug endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|api/diagnostic|api/debug-|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)',
  ]
}
