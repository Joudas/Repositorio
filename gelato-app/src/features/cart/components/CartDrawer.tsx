'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/features/cart'
import { useOrder } from '../hooks/useOrder'

type Props = {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: Props) {
  const { items, totalItems, totalPrice, incrementItem, decrementItem, removeItem, clearCart } =
    useCartStore();

  const {submitOrder, isLoading} = useOrder();
  
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({})

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open]);

  const handleSubmit = async () => {
    // Esto se envia por parte de los clientes
    const ok = await submitOrder(items)
    if (ok) {
      clearCart()
      onClose()
    }
  }

  const handleImgError = (id: string) =>
    setImgErrors((prev) => ({ ...prev, [id]: true }))

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
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
            className="relative w-full max-w-md md:max-w-lg bg-white rounded-t-3xl md:rounded-3xl shadow-xl max-h-[85dvh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-amber-100/60">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-accent" />
                <h2 className="font-outfit font-semibold text-lg text-amber-950 tracking-tight">
                  Tu carrito
                </h2>
                {totalItems > 0 && (
                  <span className="bg-amber-100/60 text-amber-800 text-xs font-sans font-semibold px-2 py-0.5 rounded-full">
                    {totalItems} {totalItems === 1 ? 'item' : 'items'}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-stone-400 hover:text-red-500 transition-colors text-xs font-sans font-medium flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Vaciar
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors"
                  aria-label="Cerrar carrito"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {items.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <div className="text-5xl select-none">🍨</div>
                  <p className="font-outfit font-semibold text-amber-950">
                    Tu carrito está vacío
                  </p>
                  <p className="font-sans text-sm text-stone-500">
                    Agrega algunos helados para empezar
                  </p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 bg-cream/50 rounded-xl p-2.5"
                  >
                    {/* Image */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-amber-50 shrink-0">
                      {item.image && !imgErrors[item.id] ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={() => handleImgError(item.id)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl select-none text-amber-200">
                          🍨
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <h3 className="font-outfit font-semibold text-amber-950 text-sm leading-tight truncate">
                        {item.name}
                      </h3>
                      <p className="font-sans font-bold text-accent text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 pt-0.5">
                        <button
                          onClick={() => decrementItem(item.id)}
                          className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-amber-100 text-amber-900 hover:bg-amber-100 transition-colors"
                          aria-label="Quitar uno"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-sans font-semibold text-amber-950 text-sm tabular-nums w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => incrementItem(item.id)}
                          className="w-6 h-6 flex items-center justify-center rounded-full bg-rose-500 text-white hover:bg-rose-600 transition-colors"
                          aria-label="Agregar uno"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 rounded-full text-stone-400 hover:text-red-500 transition-colors"
                      aria-label={`Eliminar ${item.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Total */}
            {items.length > 0 && (
              <div className="px-5 py-4 border-t border-amber-100/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-sm text-stone-500">
                    Total ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                  </span>
                    <span className="font-sans font-bold text-amber-950 text-lg tabular-nums">
                      ${totalPrice.toFixed(2)}
                    </span>
                </div>
              </div>
            )}
            <button
              disabled={isLoading}
              onClick={() => handleSubmit()}
              className="mb-6 w-[90%] self-center h-10 flex items-center justify-center rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition-colors"
              aria-label="Agregar uno"
            >
              <span className='text.white text-sm'>Realizar Pedido</span>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
