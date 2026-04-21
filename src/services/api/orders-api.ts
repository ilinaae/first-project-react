import { authAxiosInstance } from '@/services/api/auth-axios-instance.ts'
import type { CheckoutPayload, Order } from '@/types/entities.ts'

export async function createOrderRequest(payload: CheckoutPayload): Promise<Order> {
  const response = await authAxiosInstance.post<Order>('/orders', payload)
  return response.data
}

export async function getOrdersByUserIdRequest(userId: number): Promise<Order[]> {
  const response = await authAxiosInstance.get<Order[]>('/orders', {
    params: { userId },
  })

  return response.data
}
