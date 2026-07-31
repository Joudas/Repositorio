'use client'

import { AnimatePresence } from 'framer-motion'
import { ProductCardDelivery } from './ProductCardDelivery'
import type { ProductWithCategory } from '@/features/products'

type Props = {
  products: ProductWithCategory[]
  onSelect: (product: ProductWithCategory) => void
  onAdd: (product: ProductWithCategory) => void
}

export function ProductGridDelivery({ products, onSelect, onAdd }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
      <AnimatePresence mode="popLayout">
        {products.map((product) => (
          <ProductCardDelivery
            key={product.id}
            product={product}
            onSelect={onSelect}
            onAdd={onAdd}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
