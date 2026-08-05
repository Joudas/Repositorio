'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Loader2, RotateCcw, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { LucideIcon } from 'lucide-react'

type Mode = 'cancel' | 'refund'

type Props = {
  open: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  submitting: boolean
  error: string | null
  // 'cancel' (default) = cancelación al momento de cobrar; 'refund' = devolución desde historial.
  // El sistema de estados no cambia (payment_status → CANCELED); cambian los textos y el icono.
  mode?: Mode
}

const MIN_REASON_LENGTH = 3

// Configuración por modo (module-level: no se recrea en cada render)
const MODE_CONFIG: Record<Mode, { title: string; description: string; confirmLabel: string; iconTone: string; Icon: LucideIcon }> = {
  cancel: {
    title: 'Cancelar pedido',
    description:
      'El pedido se cancelará y dejará de aparecer en Por Cobrar. El motivo es obligatorio.',
    confirmLabel: 'Confirmar Cancelación',
    iconTone: 'bg-red-100 text-red-600',
    Icon: AlertTriangle,
  },
  refund: {
    title: 'Devolver pedido',
    description:
      'Se registrará la devolución del pedido y dejará de aparecer como pagado. El motivo es obligatorio.',
    confirmLabel: 'Confirmar Devolución',
    iconTone: 'bg-amber-100 text-amber-700',
    Icon: RotateCcw,
  },
}

export function CancelOrderModal({ open, onClose, onConfirm, submitting, error, mode = 'cancel' }: Props) {
  const [reason, setReason] = useState('')
  const valid = reason.trim().length >= MIN_REASON_LENGTH
  const config = MODE_CONFIG[mode]

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
                <span className={`flex h-9 w-9 items-center justify-center rounded-full ${config.iconTone}`}>
                  <config.Icon className="h-5 w-5" aria-hidden />
                </span>
                <h2 className="font-outfit text-lg font-semibold text-cacao">
                  {config.title}
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
              {config.description}
            </p>

            <label className="mt-4 block">
              <span className="font-outfit text-xs font-semibold uppercase tracking-wider text-stone-500">
                Motivo
              </span>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="Ej: cliente se retiró, pedido incorrecto…"
                className="mt-2 w-full resize-none rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 font-sans text-sm text-cacao outline-none transition-colors placeholder:text-stone-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
              />
              {reason.trim().length > 0 && !valid && (
                <span className="mt-1 block font-sans text-[11px] text-red-600">
                  El motivo debe tener al menos {MIN_REASON_LENGTH} caracteres
                </span>
              )}
            </label>

            {error && (
              <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 font-sans text-xs font-semibold text-red-700">
                {error}
              </p>
            )}

            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="h-12 flex-1 rounded-xl border border-stone-200 bg-white font-sans text-sm font-semibold text-stone-600 transition-colors hover:bg-stone-50 disabled:opacity-60"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={() => onConfirm(reason.trim())}
                disabled={!valid || submitting}
                className="flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-500 font-sans text-sm font-bold text-white transition-colors duration-150 hover:bg-red-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                ) : (
                  config.confirmLabel
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
