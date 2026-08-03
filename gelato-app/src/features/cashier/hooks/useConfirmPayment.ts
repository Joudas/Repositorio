'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateOrder } from '../api/updateOrder'

type ConfirmPaymentInput = {
  orderId: string
  paymentMethodId: string
  paymentReference?: string
}

export function useConfirmPayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderId, paymentMethodId, paymentReference }: ConfirmPaymentInput) =>
      updateOrder(orderId, {
        status: 'PAID',
        paymentMethodId,
        paymentReference,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cashier-orders'] })
    },
  })
}
