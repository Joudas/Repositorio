import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  // Protected routes — redirect to login if not authenticated
  const protectedPaths = ['/pos', '/caja', '/dashboard']
  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path),
  )

  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Login page — redirect to dashboard if already authenticated
  if (pathname.startsWith('/login') && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Role-based access control
  if (user && isProtected) {
    const role = user.user_metadata?.role as string | undefined

    if (pathname.startsWith('/pos') && role !== 'WAITER' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (pathname.startsWith('/caja') && role !== 'CASHIER' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (pathname.startsWith('/dashboard') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/pos/:path*', '/caja/:path*', '/dashboard/:path*', '/login'],
}
