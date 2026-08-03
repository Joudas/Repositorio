import type { CashierOrder } from '../types'

export type OrdersScope = 'active' | 'history'

export type OrdersFilters = {
  from?: string // YYYY-MM-DD
  to?: string // YYYY-MM-DD
  q?: string
}

export async function getOrders(
  scope: OrdersScope = 'active',
  filters?: OrdersFilters,
): Promise<CashierOrder[]> {
  const params = new URLSearchParams({ scope })
  if (filters?.from) params.set('from', filters.from)
  if (filters?.to) params.set('to', filters.to)
  if (filters?.q?.trim()) params.set('q', filters.q.trim())

  const res = await fetch(`/api/orders?${params.toString()}`)
  if (!res.ok) throw new Error('Error cargando pedidos')
  const data = await res.json()
  return data.orders as CashierOrder[]
}
