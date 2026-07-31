'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { ProductWithCategory } from '@/features/products'

type Props = {
  product: ProductWithCategory | null
  onClose: () => void
}

export function ProductDetailModal({ product, onClose }: Props) {
  const [imgError, setImgError] = useState(false)

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (product) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [product, onClose])

  // Lock body scroll while open
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [product])

  const ingredients = product?.ingredients
    ? product.ingredients.split('-').map((i) => i.trim()).filter(Boolean)
    : []

  const staticToppings = [
    'Chips de chocolate',
    'Granulado de colores',
    'Salsa de caramelo',
  ]

  return (
    <AnimatePresence>
      {product && (
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
            className="relative w-full max-w-md md:max-w-lg bg-white rounded-t-3xl md:rounded-3xl shadow-xl max-h-[90dvh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-stone-500 hover:text-stone-800 transition-colors text-sm"
              aria-label="Cerrar"
            >
              ✕
            </button>

            {/* Image */}
            <div className="relative h-56 md:h-64 bg-amber-50 rounded-t-3xl md:rounded-t-3xl overflow-hidden">
              {product.image && !imgError ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl select-none text-amber-200">
                  🍨
                </div>
              )}
              {!product.is_available && (
                <div className="absolute top-4 left-4 bg-accent text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Agotado
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5 md:p-6 space-y-5">
              {/* Name + Price */}
              <div className="space-y-1">
                <h2 className="font-outfit font-semibold text-xl md:text-2xl text-amber-950 tracking-tight">
                  {product.name}
                </h2>
                <p className="font-sans font-bold text-accent text-lg md:text-xl">
                  ${Number(product.price).toFixed(2)}
                </p>
              </div>

              {/* Description */}
              {product.description && (
                <p className="font-sans text-sm text-stone-600 leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Ingredients */}
              {ingredients.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-outfit font-semibold text-sm text-amber-950 uppercase tracking-wider">
                    Ingredientes
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {ingredients.map((item, i) => (
                      <span
                        key={i}
                        className="bg-amber-50 text-amber-800 text-xs font-sans font-medium px-3 py-1 rounded-full"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Toppings */}
              <div className="space-y-2">
                <h3 className="font-outfit font-semibold text-sm text-amber-950 uppercase tracking-wider">
                  Toppings (próximamente)
                </h3>
                <ul className="space-y-1.5">
                  {staticToppings.map((topping, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 font-sans text-sm text-stone-500"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shrink-0" />
                      {topping}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
