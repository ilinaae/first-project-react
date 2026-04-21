import type { CartState } from '@/types/entities.ts'

const CART_STORAGE_KEY = 'flora-boutique-cart'

export function getStoredCart(): CartState | null {
  const rawValue = window.localStorage.getItem(CART_STORAGE_KEY)

  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue) as CartState
  } catch {
    return null
  }
}

export function setStoredCart(cart: CartState) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
}

export function clearStoredCart() {
  window.localStorage.removeItem(CART_STORAGE_KEY)
}


