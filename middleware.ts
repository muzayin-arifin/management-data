
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/jwt'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublic = path.startsWith('/login') || path.startsWith('/register') || path.startsWith('/api/auth') || path.startsWith('/_next') || path === '/'

  const token = request.cookies.get('auth-token')?.value

  // 1. If trying to access protected route without token
  if (!isPublic && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. If token exists, verify it
  if (token) {
    const payload = await verifyToken(token)
    
    // If invalid token on protected route -> redirect to login
    if (!payload && !isPublic) {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('auth-token')
      return response
    }

    // If valid token on login page -> redirect to dashboard
    if (payload && path === '/login') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
