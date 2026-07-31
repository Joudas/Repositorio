export type KitchenOrderItem = {
  id: string
  quantity: number
  unit_price: number
  products: {
    id: string
    name: string
    ingredients: string | null
  }
}

export type KitchenOrder = {
  id: string
  order_type: 'DINE_IN' | 'TAKEAWAY'
  status: 'PENDING' | 'READY'
  table_number: number | null
  total_amount: number
  created_at: string
  order_items: KitchenOrderItem[]
}
