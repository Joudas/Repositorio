import type { Metadata } from 'next'
import { KitchenClient } from './KitchenClient'

export const metadata: Metadata = {
  title: 'Cocina · Punto Glaceal',
}

export default function CocinaPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <KitchenClient />
    </main>
  )
}
