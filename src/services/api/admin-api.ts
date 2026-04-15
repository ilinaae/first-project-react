import { axiosInstance } from '@/services/api/axios-instance.ts'
import type { Order, OrderStatus, Product, ProductFormValues } from '@/types/entities.ts'

export async function getAllProductsRequest() {
  const response = await axiosInstance.get<Product[]>('/products')
  return response.data
}

export async function createProductRequest(payload: ProductFormValues) {
  const response = await axiosInstance.post<Product>('/products', {
    ...payload,
    tags: ['новинка'],
  })

  return response.data
}

export async function updateProductRequest(productId: number, payload: ProductFormValues) {
  const response = await axiosInstance.put<Product>(`/products/${productId}`, {
    ...payload,
    tags: ['обновлено'],
  })

  return response.data
}

export async function patchProductAvailabilityRequest(
  productId: number,
  isAvailable: boolean,
) {
  const response = await axiosInstance.patch<Product>(`/products/${productId}`, {
    isAvailable,
  })

  return response.data
}

export async function deleteProductRequest(productId: number) {
  await axiosInstance.delete(`/products/${productId}`)
}

export async function getAllOrdersRequest() {
  const response = await axiosInstance.get<Order[]>('/orders')
  return response.data
}

export async function patchOrderStatusRequest(orderId: number, status: OrderStatus) {
  const response = await axiosInstance.patch<Order>(`/orders/${orderId}`, {
    status,
  })

  return response.data
}
