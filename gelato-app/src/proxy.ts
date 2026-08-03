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
  // Nota: /caja es público temporalmente (como /kitchen). Se restaura
  // en esta lista y en el matcher cuando exista login.
  const protectedPaths = ['/pos', '/dashboard']
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
    // /caja: acceso público temporal — sin RBAC hasta que exista login.
    if (pathname.startsWith('/dashboard') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return response
}

export const config = {
  // /caja fuera del matcher: acceso público temporal (se restaura con login)
  matcher: ['/pos/:path*', '/dashboard/:path*', '/login'],
}
