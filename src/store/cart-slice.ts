import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { CartItem, CartState } from '@/types/entities.ts'
import { calculateCartTotal } from '@/utils/calculate-cart-total.ts'
import { clearStoredCart, getStoredCart, setStoredCart } from '@/utils/cart-storage.ts'

const storedCart = getStoredCart()

const initialState: CartState = storedCart ?? {
  items: [],
  total: 0,
}

const cartSlice = createSlice({
  initialState,
  name: 'cart',
  reducers: {
    addCartItem: (state, action: PayloadAction<CartItem>) => {
      const incomingItem = action.payload
      const existingItem =
        incomingItem.type === 'product'
          ? state.items.find(
              (item) => item.type === 'product' && item.title === incomingItem.title,
            )
          : null

      if (existingItem) {
        existingItem.quantity += incomingItem.quantity
      } else {
        state.items.push(incomingItem)
      }

      state.total = calculateCartTotal(state.items)
      setStoredCart(state)
    },
    clearCart: (state) => {
      state.items = []
      state.total = 0
      clearStoredCart()
    },
    resetCartState: () => {
      clearStoredCart()
      return { items: [], total: 0 }
    },
    removeCartItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
      state.total = calculateCartTotal(state.items)
      setStoredCart(state)
    },
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>,
    ) => {
      const target = state.items.find((item) => item.id === action.payload.id)

      if (!target) {
        return
      }

      target.quantity = Math.max(1, action.payload.quantity)
      state.total = calculateCartTotal(state.items)
      setStoredCart(state)
    },
  },
})

export const {
  addCartItem,
  clearCart,
  removeCartItem,
  resetCartState,
  updateCartItemQuantity,
} = cartSlice.actions
export const cartReducer = cartSlice.reducer
