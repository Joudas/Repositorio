'use client'

import { useState } from 'react'
import { Power } from 'lucide-react'
import { useLogout } from '../hooks/useLogout'
import { LogoutConfirmModal } from './LogoutConfirmModal'

type Props = {
  userName: string
}

// Contenedor de vista: orquesta el modal y el hook de logout.
// No renderiza nada que dependa de data fetching (server-serialization:
// el layout pasa solo el nombre como prop).
export function ProtectedHeader({ userName }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const { signingOut, signOut } = useLogout()

  const handleConfirm = async () => {
    await signOut()
    // useLogout navega a /login y refresca la ruta; no hace falta cerrar el modal
  }

  // Avatar: primer carácter del nombre (cálculo barato, sin memo necesario)
  const initial = userName.trim().charAt(0).toUpperCase() || '?'

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-amber-200/60 bg-cream/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4">
          <span className="font-outfit text-lg font-semibold text-cacao">
            Punto Glacial
          </span>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-full border border-amber-200/60 bg-white/70 py-1 pl-1 pr-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                {initial}
              </span>
              <span className="max-w-32 truncate text-sm font-medium text-cacao">
                {userName}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              aria-label="Cerrar sesión"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-200/60 bg-white/70 text-stone-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/30"
            >
              <Power className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      </header>

      <LogoutConfirmModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
        signingOut={signingOut}
      />
    </>
  )
}
