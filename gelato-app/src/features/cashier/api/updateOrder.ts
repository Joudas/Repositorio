export type UpdateOrderInput =
  | { status: 'READY' }
  | { status: 'PAID'; paymentMethodId: string; paymentReference?: string }
  | { status: 'CANCELED'; cancelReason: string }

export async function updateOrder(id: string, input: UpdateOrderInput): Promise<void> {
  const body =
    input.status === 'READY'
      ? { status: 'READY' as const }
      : input.status === 'PAID'
        ? {
            status: 'PAID' as const,
            payment_method_id: input.paymentMethodId,
            payment_reference: input.paymentReference?.trim() || undefined,
          }
        : {
            status: 'CANCELED' as const,
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
