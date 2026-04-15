import { axiosInstance } from '@/services/api/axios-instance.ts'
import type { CheckoutPayload, Order } from '@/types/entities.ts'

export async function createOrderRequest(payload: CheckoutPayload) {
  const response = await axiosInstance.post<Order>('/orders', {
    ...payload,
    createdAt: new Date().toISOString(),
    status: 'new',
  })

  return response.data
}

export async function getOrdersByUserIdRequest(userId: number) {
  const response = await axiosInstance.get<Order[]>('/orders', {
    params: { userId },
  })

  return response.data
}
