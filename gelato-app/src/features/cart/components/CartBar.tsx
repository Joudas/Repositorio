'use client'

import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/features/cart'

type Props = {
  onOpen: () => void
}

export function CartBar({ onOpen }: Props) {
  const totalItems = useCartStore((s) => s.totalItems)
  const totalPrice = useCartStore((s) => s.totalPrice)

  if (totalItems === 0) return null

  return (
    <motion.button
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ type: 'spring', damping: 26, stiffness: 300 }}
      onClick={onOpen}
      className="fixed bottom-4 left-4 right-4 z-40 flex items-center gap-3 bg-amber-950 text-white rounded-2xl px-4 py-3 shadow-xl hover:shadow-2xl transition-shadow"
    >
      {/* Cantidad */}
      <span className="shrink-0 inline-flex items-center gap-1.5 bg-cream text-amber-950 font-sans font-bold text-sm px-3 py-1.5 rounded-full">
        <ShoppingBag className="w-4 h-4" />
        {totalItems}
      </span>

      {/* Ver carrito */}
      <span className="flex-1 text-center font-outfit font-semibold text-base tracking-tight">
        Ver Carrito
      </span>

      {/* Total */}
      <span className="shrink-0 font-sans font-bold text-base tabular-nums">
        ${totalPrice.toFixed(2)}
      </span>
    </motion.button>
  )
}
