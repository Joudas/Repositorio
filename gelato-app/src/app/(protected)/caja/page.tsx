import type { Metadata } from 'next'
import { CashierClient } from './CashierClient'

export const metadata: Metadata = {
  title: 'Caja · Punto Glaceal',
}

export default function CajaPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <CashierClient />
    </main>
  )
}
