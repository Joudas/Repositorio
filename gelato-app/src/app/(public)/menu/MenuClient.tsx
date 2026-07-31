'use client'

import { useState, useMemo } from 'react'
import { CategoryFilter, ProductGrid, ProductDetailModal } from '@/features/products'
import type { ProductWithCategory, Category } from '@/features/products'

type Props = {
  products: ProductWithCategory[]
  categories: Category[]
}

export function MenuClient({ products, categories }: Props) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<ProductWithCategory | null>(null)

  const filtered = useMemo(
    () =>
      activeSlug === null
        ? products
        : products.filter((p) => p.categories.slug === activeSlug),
    [products, activeSlug],
  )

  const grouped = useMemo(() => {
    const map = new Map<string, ProductWithCategory[]>()
    for (const p of filtered) {
      const key = p.categories.name
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(p)
    }
    return Array.from(map.entries())
  }, [filtered])

  return (
    <>
      <div className="max-w-lg md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <header className="text-center space-y-1">
          <h1 className="font-outfit font-semibold text-2xl md:text-3xl text-amber-950 tracking-tight">
            Punto Glaceal
          </h1>
          <p className="text-stone-500 text-xs font-sans">
            Heladería & Dulcería Artesanal
          </p>
        </header>

        {/* Filters */}
        <CategoryFilter
          categories={categories}
          activeSlug={activeSlug}
          onSelect={setActiveSlug}
        />

        {/* Products by category */}
        <div className="space-y-6">
          {grouped.map(([categoryName, categoryProducts]) => (
            <section key={categoryName} className="space-y-3">
              <h2 className="font-outfit font-semibold text-lg text-amber-950 tracking-tight px-1">
                {categoryName}
              </h2>
              <ProductGrid products={categoryProducts} onSelect={setSelectedProduct} />
            </section>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-stone-400 py-12 font-sans text-sm">
            No hay productos disponibles en esta categoría.
          </p>
        )}
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  )
}
