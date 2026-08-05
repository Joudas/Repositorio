export type OrderIdentitySource = {
  order_type: 'DINE_IN' | 'TAKEAWAY'
  table_number: number | null
  order_number: number | null
}

export type OrderIdentity = {
  primary: string
  secondary: string | null
}

// Formatea el # de orden con padding a 3 dígitos: 15 → '#015'
// js-early-exit: null → '—' sin tocar el número
export function formatShortNumber(orderNumber: number | null): string {
  if (orderNumber === null) return '—'
  return `#${String(orderNumber).padStart(3, '0')}`
}

// Identificador según el tipo de pedido (misma secuencia `order_number`,
// sin numeración diaria):
// - TAKEAWAY ("Para Llevar") → primario '#016', sin secundario
// - DINE_IN ("En Mesa")      → primario 'Mesa 4' (o 'En Mesa' sin mesa),
//                              secundario '#015'
export function getOrderIdentity(order: OrderIdentitySource): OrderIdentity {
  const short = formatShortNumber(order.order_number)

  if (order.order_type === 'TAKEAWAY') {
    return { primary: short, secondary: null }
  }

  const table = order.table_number !== null ? `Mesa ${order.table_number}` : 'En Mesa'
  return { primary: table, secondary: short }
}
