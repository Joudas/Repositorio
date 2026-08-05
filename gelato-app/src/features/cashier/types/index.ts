export type CashierOrderItem = {
  id: string
  quantity: number
  unit_price: number
  products: {
    id: string
    name: string
    ingredients: string | null
    image: string | null
  }
}

export type KitchenStatus = 'PENDING' | 'IN_PREPARATION' | 'READY'
export type PaymentStatus = 'UNPAID' | 'PAID' | 'CANCELED'

export type CashierOrder = {
  id: string
  order_number: number | null // #Orden (secuencia order_number_seq)
  order_type: 'DINE_IN' | 'TAKEAWAY'
  kitchen_status: KitchenStatus
  payment_status: PaymentStatus
  table_number: number | null
  total_amount: number
  observation: string | null
  cancel_reason: string | null
  created_at: string
  paid_at: string | null // lo setea el trigger al pasar a PAID; señala "Devolución" en CANCELED
  order_items: CashierOrderItem[]
  users: { name: string } | null // "Atendido por" (null → no mostrar, se asume para llevar)
  payment_methods: { name: string } | null
}

export type PaymentMethod = {
  id: string
  name: string
  is_active: boolean
  requires_reference: boolean
}
