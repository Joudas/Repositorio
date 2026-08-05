export type UpdateOrderInput =
  | { kitchenStatus: 'READY' }
  | { paymentStatus: 'PAID'; paymentMethodId: string; paymentReference?: string }
  | { paymentStatus: 'CANCELED'; cancelReason: string }

export async function updateOrder(id: string, input: UpdateOrderInput): Promise<void> {
  const body =
    'kitchenStatus' in input
      ? { kitchen_status: 'READY' as const }
      : input.paymentStatus === 'PAID'
        ? {
            payment_status: 'PAID' as const,
            payment_method_id: input.paymentMethodId,
            payment_reference: input.paymentReference?.trim() || undefined,
          }
        : {
            payment_status: 'CANCELED' as const,
            cancel_reason: input.cancelReason,
          }

  const res = await fetch(`/api/orders/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.error ?? 'Error actualizando pedido')
  }
}
