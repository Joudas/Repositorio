'use client'

import { useQuery } from '@tanstack/react-query'
import { getPaymentMethods } from '../api/getPaymentMethods'

export function usePaymentMethods() {
  return useQuery({
    queryKey: ['payment-methods'],
    queryFn: getPaymentMethods,
  })
}
