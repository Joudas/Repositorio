import type { PaymentMethod } from '../types'

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const res = await fetch('/api/payment-methods')
  if (!res.ok) throw new Error('Error cargando métodos de pago')
  const data = await res.json()
  return data.methods as PaymentMethod[]
}
