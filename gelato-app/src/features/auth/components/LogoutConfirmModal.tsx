'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, Power, X } from 'lucide-react'
import { useEffect } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  signingOut: boolean
}

// Mismo patrón que CancelOrderModal (features/cashier): AnimatePresence,
// cierre con Escape, bloqueo de scroll del body y bottom-sheet en mobile.
export function LogoutConfirmModal({ open, onClose, onConfirm, signingOut }: Props) {
  // Cerrar con Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  // Bloquear scroll del body mientras está abierto
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full max-w-md rounded-t-3xl bg-white p-5 shadow-xl md:rounded-3xl md:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <Power className="h-5 w-5" aria-hidden />
                </span>
                <h2 className="font-outfit text-lg font-semibold text-cacao">
                  Cerrar sesión
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition-colors hover:text-stone-800"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            <p className="mt-2 font-sans text-sm text-stone-500">
              ¿Seguro que querés cerrar la sesión? Vas a volver a la pantalla de
              inicio de sesión.
            </p>

            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={signingOut}
                className="h-12 flex-1 rounded-xl border border-stone-200 bg-white font-sans text-sm font-semibold text-stone-600 transition-colors hover:bg-stone-50 disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={signingOut}
                className="flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-500 font-sans text-sm font-bold text-white transition-colors duration-150 hover:bg-red-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {signingOut ? (
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                ) : (
                  'Cerrar sesión'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
