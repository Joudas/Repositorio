'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useMarkReady() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'READY' }),
      })
      if (!res.ok) throw new Error('Error actualizando pedido')
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] }),
  })
}
