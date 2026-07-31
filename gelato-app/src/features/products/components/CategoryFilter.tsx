'use client'

import type { Category } from '@/features/products'

type Props = {
  categories: Category[]
  activeSlug: string | null
  onSelect: (slug: string | null) => void
}

export function CategoryFilter({ categories, activeSlug, onSelect }: Props) {
  return (
    <nav className="flex flex-nowrap md:flex-wrap md:justify-center gap-2 overflow-x-auto md:overflow-visible pb-1 scrollbar-none">
      <button
        onClick={() => onSelect(null)}
        className={`shrink-0 px-5 py-2 rounded-full text-sm font-sans font-medium transition-all duration-200 ${
          activeSlug === null
            ? 'bg-accent text-white shadow-sm'
            : 'bg-amber-100/60 text-amber-800/70 hover:bg-amber-100 hover:text-amber-900'
        }`}
      >
        Todo
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.slug)}
          className={`shrink-0 px-5 py-2 rounded-full text-sm font-sans font-medium transition-all duration-200 ${
            activeSlug === cat.slug
              ? 'bg-accent text-white shadow-sm'
              : 'bg-amber-100/60 text-amber-800/70 hover:bg-amber-100 hover:text-amber-900'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </nav>
  )
}
