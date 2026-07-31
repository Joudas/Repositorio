'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, CartState } from '@/features/cart/types'

const emptyCart = (): Pick<CartState, 'items' | 'totalItems' | 'totalPrice'> => ({
  items: [] as CartItem[],
  totalItems: 0,
  totalPrice: 0,
})

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      ...emptyCart(),

      addItem: (product) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id)
          const items = existing
            ? state.items.map((i) =>
                i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
              )
            : [
                ...state.items,
                { ...product, quantity: 1 },
              ]
          return {
            items,
            totalItems: items.reduce((acc, i) => acc + i.quantity, 0),
            totalPrice: items.reduce(
              (acc, i) => acc + i.price * i.quantity,
              0,
            ),
          }
        }),

      removeItem: (id) =>
        set((state) => {
          const items = state.items.filter((i) => i.id !== id)
          return {
            items,
            totalItems: items.reduce((acc, i) => acc + i.quantity, 0),
            totalPrice: items.reduce(
              (acc, i) => acc + i.price * i.quantity,
              0,
            ),
          }
        }),

      incrementItem: (id) =>
        set((state) => {
          const items = state.items.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i,
          )
          return {
            items,
            totalItems: items.reduce((acc, i) => acc + i.quantity, 0),
            totalPrice: items.reduce(
              (acc, i) => acc + i.price * i.quantity,
              0,
            ),
          }
        }),

      decrementItem: (id) =>
        set((state) => {
          const items = state.items
            .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
            .filter((i) => i.quantity > 0)
          return {
            items,
            totalItems: items.reduce((acc, i) => acc + i.quantity, 0),
            totalPrice: items.reduce(
              (acc, i) => acc + i.price * i.quantity,
              0,
            ),
          }
        }),

      clearCart: () => set({ ...emptyCart() }),

    }),
    { name: 'gelato-cart' },
  ),
)
