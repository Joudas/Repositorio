'use client'

import { useQuery } from '@tanstack/react-query'
import { getOrders, type OrdersFilters } from '../api/getOrders'

export function useSalesHistory(filters?: OrdersFilters) {
  return useQuery({
    queryKey: [
      'cashier-history',
      filters?.from ?? 'today',
      filters?.to ?? 'today',
      filters?.q ?? '',
    ],
    queryFn: () => getOrders('history', filters),
    refetchInterval: 5000, // polling 5 s (mismo patrón que el resto de caja)
  })
}
