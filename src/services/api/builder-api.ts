import { authAxiosInstance } from '@/services/api/auth-axios-instance.ts'
import type { ExtraService, PackagingOption, Product } from '@/types/entities.ts'

export async function getFlowersRequest(): Promise<Product[]> {
  const response = await authAxiosInstance.get<Product[]>('/products', {
    params: { category: 'flower' },
  })

  return response.data
}

export async function getPackagingOptionsRequest(): Promise<PackagingOption[]> {
  const response = await authAxiosInstance.get<PackagingOption[]>('/packaging-options')
  return response.data
}

export async function getExtraServicesRequest(): Promise<ExtraService[]> {
  const response = await authAxiosInstance.get<ExtraService[]>('/extra-services')
  return response.data
}
