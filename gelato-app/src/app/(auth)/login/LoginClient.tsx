'use client'

import { LoginForm } from '@/features/auth'

export default function LoginClient() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-amber-200/60 bg-white/70 p-6 shadow-xl backdrop-blur-sm sm:p-8">
        <div className="mb-6 text-center">
          <p className="text-3xl" aria-hidden="true">🍨</p>
          <h1 className="font-outfit mt-2 text-2xl font-semibold text-cacao">
            Punto Glacial
          </h1>
          <p className="text-muted mt-1 text-sm">Ingresá para gestionar el negocio</p>
        </div>

        <LoginForm />
      </div>
    </main>
  )
}
