'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import type { ProductWithCategory } from '@/features/products'
import { useCartStore } from '@/features/cart/store/cartStore'

type Props = {
  product: ProductWithCategory
  onSelect: (product: ProductWithCategory) => void
  onAdd: (product: ProductWithCategory) => void
}

export function ProductCardDelivery({ product, onSelect, onAdd }: Props) {
  const [imgError, setImgError] = useState(false)
  const unavailable = !product.is_available

  const quantity = useCartStore(
    (s) => s.items.find((i) => i.id === product.id)?.quantity ?? 0,
  )
  const incrementItem = useCartStore((s) => s.incrementItem)
  const decrementItem = useCartStore((s) => s.decrementItem)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(product)}
      className={`group bg-white rounded-2xl p-3 shadow-sm border border-amber-100/60 transition-shadow duration-200 hover:shadow-md cursor-pointer ${
        unavailable ? 'opacity-50' : ''
      }`}
    >
      {/* Image */}
      <div className="relative h-28 md:h-36 rounded-xl overflow-hidden bg-amber-50/50">
        {product.image && !imgError ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl select-none text-amber-200">
            🍨
          </div>
        )}

        {/* Agotado overlay */}
        {unavailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <span className="bg-accent text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Agotado
            </span>
          </div>
        )}

        {/* Add button / quantity stepper */}
        {!unavailable && (
          <AnimatePresence initial={false} mode="popLayout">
            {quantity === 0 ? (
              <motion.button
                key="add"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={(e) => {
                  e.stopPropagation()
                  onAdd(product)
                }}
                whileTap={{ scale: 0.92 }}
                className="absolute bottom-2 right-2 w-9 h-9 flex items-center justify-center rounded-full bg-rose-500 text-white shadow-md hover:bg-rose-600 transition-colors z-10"
                aria-label={`Agregar ${product.name} al carrito`}
              >
                <Plus className="w-5 h-5" strokeWidth={2.5} />
              </motion.button>
            ) : (
              <motion.div
                key="stepper"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-2 right-2 z-10 flex items-center bg-white rounded-full shadow-md border border-amber-100"
              >
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    decrementItem(product.id)
                  }}
                  className="w-8 h-8 flex items-center justify-center text-rose-500 hover:bg-rose-100 transition-colors rounded-l-full"
                  aria-label={`Quitar ${product.name} del carrito`}
                >
                  <Minus className="w-4 h-4" strokeWidth={2.5} />
                </motion.button>
                <span className="min-w-6 text-center font-sans font-bold text-sm text-amber-950 tabular-nums">
                  {quantity}
                </span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    incrementItem(product.id)
                  }}
                  className="w-8 h-8 flex items-center justify-center text-rose-500 hover:bg-rose-100 transition-colors rounded-r-full"
                  aria-label={`Agregar ${product.name} al carrito`}
                >
                  <Plus className="w-4 h-4" strokeWidth={2.5} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Content */}
      <div className="mt-2 space-y-1">
        <h3 className="font-outfit font-semibold text-amber-950 text-sm md:text-base leading-tight line-clamp-1">
          {product.name}
        </h3>
        {product.description && (
          <p className="font-sans text-[11px] md:text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
        <div className="pt-0.5">
          <span className="font-sans font-bold text-amber-950 text-sm md:text-base">
            ${Number(product.price).toFixed(2)}
          </span>
        </div>
      </div>
    </motion.article>
  )
}
