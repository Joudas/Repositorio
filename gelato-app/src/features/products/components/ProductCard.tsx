'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import type { ProductWithCategory } from '@/features/products'
// import Image from 'next/image'

type Props = {
  product: ProductWithCategory
  onSelect: (product: ProductWithCategory) => void
}

export function ProductCard({ product, onSelect }: Props) {
  const [imgError, setImgError] = useState(false)
  const unavailable = !product.is_available

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
