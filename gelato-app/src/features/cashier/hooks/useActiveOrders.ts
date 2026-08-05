'use client'

import { useQuery } from '@tanstack/react-query'
import { getOrders } from '../api/getOrders'

export function useActiveOrders() {
  return useQuery({
    queryKey: ['cashier-orders'],
    queryFn: () => getOrders('active', undefined, 'cashier'),
    refetchInterval: 5000, // polling 5 s (mismo patrón que la cocina)
  })
}
