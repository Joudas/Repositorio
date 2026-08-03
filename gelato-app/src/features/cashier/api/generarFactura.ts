import type { CashierOrder } from '../types'

export type FacturaData = {
  order: CashierOrder
  methodName: string | null
  reference?: string
  received?: number
  change?: number
}

/**
 * Genera la factura de la orden cobrada.
 * Por ahora solo la registra en consola (DevTools) con todos los datos;
 * a futuro se persistirá o imprimirá.
 */
export function generarFactura({ order, methodName, reference, received, change }: FacturaData) {
  console.log('🧾 FACTURA', {
    '#orden': order.order_number,
    id: order.id,
    fecha: order.created_at,
    tipo: order.order_type, // TAKEAWAY | DINE_IN
    mesa: order.order_type === 'DINE_IN' ? order.table_number : null,
    mesero: order.users?.name ?? null,
    items: order.order_items.map((item) => ({
      nombre: item.products.name,
      cantidad: item.quantity,
      unit_price: Number(item.unit_price),
      subtotal: item.quantity * Number(item.unit_price),
    })),
    total: Number(order.total_amount),
    metodo_pago: methodName,
    referencia: reference?.trim() || null,
    recibido: received ?? null,
    cambio: change ?? null,
  })
}
