'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateOrder } from '../api/updateOrder'

type CancelOrderInput = {
  orderId: string
  cancelReason: string
}

export function useCancelOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderId, cancelReason }: CancelOrderInput) =>
      updateOrder(orderId, { paymentStatus: 'CANCELED', cancelReason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cashier-orders'] })
    },
  })
}
