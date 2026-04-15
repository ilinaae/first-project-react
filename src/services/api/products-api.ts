import { axiosInstance } from '@/services/api/axios-instance.ts'
import type { Product, ProductCategory } from '@/types/entities.ts'

export async function getProductsRequest(category?: ProductCategory) {
  const response = await axiosInstance.get<Product[]>('/products', {
    params: category ? { category } : undefined,
  })

  return response.data
}
