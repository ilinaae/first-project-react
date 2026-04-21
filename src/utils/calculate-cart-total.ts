import type { CartItem } from '@/types/entities.ts'

export function calculateCartTotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0)
}

