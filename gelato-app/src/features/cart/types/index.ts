export type CartItem = {
  id: string
  name: string
  price: number
  image: string | null
  quantity: number
}

export type CartItemInput = {
  id: string
  name: string
  price: number
  image: string | null
}

export type CartState = {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addItem: (product: CartItemInput) => void
  removeItem: (id: string) => void
  incrementItem: (id: string) => void
  decrementItem: (id: string) => void
  clearCart: () => void
}

export interface CreateOrderInput {
  orderType: 'TAKEAWAY' | 'DINE_IN';
  items: CartItem[];
  totalAmount: number;
}
