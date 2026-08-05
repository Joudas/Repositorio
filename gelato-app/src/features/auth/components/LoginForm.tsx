'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // 1. Supabase Auth valida contra auth.users (passwords hasheados).
    //    Nosotros nunca vemos ni comparamos la contraseña.
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    // 2. Error → mostramos el mensaje REAL de Supabase (debug).
    if (error) {
      console.error('Login error:', error)
      setError(error.message)
      return
    }

    // 3. Éxito → redirigir al home del rol (mismo mapa que el proxy).
    const role = data.user?.user_metadata?.role as string | undefined
    const home =
      role === 'KITCHEN' ? '/kitchen' :
      role === 'WAITER'  ? '/waiter' :
      '/cashier' // CASHIER y ADMIN (hasta que exista /dashboard)

    router.push(home)
    router.refresh() // re-evalúa la sesión en el servidor
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-cacao text-sm font-medium">
          Email
        </label>
        <div className="relative">
          <Mail className="text-muted absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="correo@glaceal.com"
            className="bg-white h-10 pl-9"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-cacao text-sm font-medium">
          Contraseña
        </label>
        <div className="relative">
          <Lock className="text-muted absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            className="bg-white h-10 pr-10 pl-9"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="text-muted hover:text-cacao absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:outline-none"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="bg-destructive/10 text-destructive rounded-lg px-3 py-2 text-sm"
        >
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="bg-accent text-white hover:bg-accent/90 h-10 w-full"
      >
        {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        {loading ? 'Ingresando…' : 'Iniciar Sesión'}
      </Button>
    </form>
  )
}
