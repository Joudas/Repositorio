import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  // Usar la clave anónima o publishable de forma segura
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
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
  })

  // Obtenemos el usuario autenticado desde las cookies de sesión
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  // Comprobar si la ruta actual es protegida
  const protectedPaths = ['/waiter', '/cashier', '/dashboard', '/kitchen']
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path))

  // 1. Si intenta entrar a una ruta protegida y NO está logueado -> Redirigir a /login
  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Extraer el rol (Revisa user_metadata o app_metadata)
  let role = (user?.user_metadata?.role || user?.app_metadata?.role) as
    | string
    | undefined

  if (!role && user) {
    const { data: dbUser } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
      
    role = dbUser?.role
  }

  // 2. Si ya está logueado e intenta entrar a /login -> Redirigir según su rol
  if (pathname.startsWith('/login') && user) {
    const home =
      role === 'CASHIER'
        ? '/cashier'
        : role === 'ADMIN'
        ? '/dashboard'
        : role === 'WAITER'
        ? '/waiter'
        : role === 'KITCHEN'
        ? '/kitchen'
        : '/'

    return NextResponse.redirect(new URL(home, request.url))
  }

  // 3. Control de acceso basado en roles para rutas protegidas
  if (user && isProtected) {    // Si el usuario no tiene rol asignado en la metadata aún, evitamos bloquearlo al login
    // o asegúrate de asignárselo en Supabase Auth metadata.
    if (!role) {
      console.warn(`[Auth Middleware] Usuario ${user.id} no tiene rol asignado en metadata.`)
      // Puedes redirigirlo a una página por defecto o a login si exige rol
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (pathname.startsWith('/waiter') && role !== 'WAITER' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (pathname.startsWith('/cashier') && role !== 'CASHIER' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (pathname.startsWith('/kitchen') && role !== 'KITCHEN' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (pathname.startsWith('/dashboard') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // 4. /delivery es público para clientes sin sesión (autopédido), pero
  //    CASHIER y KITCHEN no pueden entrar logueados → redirect a su home.
  if (user && pathname.startsWith('/delivery')) {
    if (role === 'CASHIER') {
      return NextResponse.redirect(new URL('/cashier', request.url))
    }
    if (role === 'KITCHEN') {
      return NextResponse.redirect(new URL('/kitchen', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/waiter/:path*',
    '/cashier/:path*',
    '/kitchen/:path*',
    '/dashboard/:path*',
    '/delivery',
    '/login',
  ],
}