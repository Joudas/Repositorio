'use client'

import { useQuery } from '@tanstack/react-query'
import type { KitchenOrder } from '../types'

export function useKitchenOrders() {
  return useQuery({
    queryKey: ['kitchen-orders'],
    queryFn: async () => {
      const res = await fetch('/api/orders?view=kitchen')
      if (!res.ok) throw new Error('Error cargando pedidos')
      const data = await res.json()
      return data.orders as KitchenOrder[]
    },
    refetchInterval: 5000, // polling 5 s
  })
}
