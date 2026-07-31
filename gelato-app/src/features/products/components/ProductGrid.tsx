'use client'

import { AnimatePresence } from 'framer-motion'
import { ProductCard } from './ProductCard'
import type { ProductWithCategory } from '@/features/products'

type Props = {
  products: ProductWithCategory[]
  onSelect: (product: ProductWithCategory) => void
}

export function ProductGrid({ products, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
      <AnimatePresence mode="popLayout">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onSelect={onSelect} />
        ))}
      </AnimatePresence>
    </div>
  )
}
