export type KitchenOrderItem = {
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

export type KitchenOrder = {
  id: string
  order_number: number | null // #Ticket (misma secuencia order_number_seq)
  order_type: 'DINE_IN' | 'TAKEAWAY'
  kitchen_status: 'PENDING' | 'IN_PREPARATION' | 'READY'
  table_number: number | null
  total_amount: number
  observation: string | null
  created_at: string
  order_items: KitchenOrderItem[]
}
