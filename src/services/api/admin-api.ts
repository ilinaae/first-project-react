import { authAxiosInstance } from '@/services/api/auth-axios-instance.ts'
import type { Order, OrderStatus, Product, ProductFormValues } from '@/types/entities.ts'

export async function getAllProductsRequest(): Promise<Product[]> {
  const response = await authAxiosInstance.get<Product[]>('/products')
  return response.data
}

export async function createProductRequest(payload: ProductFormValues): Promise<Product> {
  const response = await authAxiosInstance.post<Product>('/products', payload)
  return response.data
}

export async function updateProductRequest(
  productId: number,
  payload: ProductFormValues,
): Promise<Product> {
  const response = await authAxiosInstance.put<Product>(`/products/${productId}`, payload)
  return response.data
}

export async function patchProductAvailabilityRequest(
  productId: number,
  isAvailable: boolean,
): Promise<Product> {
  const response = await authAxiosInstance.patch<Product>(`/products/${productId}`, {
    isAvailable,
  })

  return response.data
}

export async function deleteProductRequest(productId: number): Promise<void> {
  await authAxiosInstance.delete(`/products/${productId}`)
}

export async function getAllOrdersRequest(): Promise<Order[]> {
  const response = await authAxiosInstance.get<Order[]>('/orders')
  return response.data
}

export async function patchOrderStatusRequest(orderId: number, status: OrderStatus): Promise<Order> {
  const response = await authAxiosInstance.patch<Order>(`/orders/${orderId}`, {
    status,
  })

  return response.data
}

