import { axiosInstance } from '@/services/api/axios-instance.ts'
import type { ExtraService, PackagingOption, Product } from '@/types/entities.ts'

export async function getFlowersRequest() {
  const response = await axiosInstance.get<Product[]>('/products', {
    params: { category: 'flower' },
  })

  return response.data
}

export async function getPackagingOptionsRequest() {
  const response = await axiosInstance.get<PackagingOption[]>('/packagingOptions')
  return response.data
}

export async function getExtraServicesRequest() {
  const response = await axiosInstance.get<ExtraService[]>('/extraServices')
  return response.data
}
