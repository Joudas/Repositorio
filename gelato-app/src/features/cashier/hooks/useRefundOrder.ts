'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateOrder } from '../api/updateOrder'

type RefundOrderInput = {
  orderId: string
  cancelReason: string
}

// Devolución = CANCELED desde PAID (el API ya lo valida). Invalida historial,
// por cobrar y cocina (el pedido devuelto sale de cocina vía view=kitchen).
export function useRefundOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderId, cancelReason }: RefundOrderInput) =>
      updateOrder(orderId, { paymentStatus: 'CANCELED', cancelReason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cashier-history'] })
      queryClient.invalidateQueries({ queryKey: ['cashier-orders'] })
      queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] })
    },
  })
}
