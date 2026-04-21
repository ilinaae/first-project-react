import { authAxiosInstance } from '@/services/api/auth-axios-instance.ts'
import type { Product, ProductCategory } from '@/types/entities.ts'

export async function getProductsRequest(category?: ProductCategory): Promise<Product[]> {
  const response = await authAxiosInstance.get<Product[]>('/products', {
    params: category ? { category } : undefined,
  })

  return response.data
}

