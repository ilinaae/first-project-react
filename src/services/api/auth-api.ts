import { authAxiosInstance, type BackendAuthResponse } from '@/services/api/auth-axios-instance.ts'
import type { LoginPayload, RegisterPayload, User } from '@/types/entities.ts'

export type AuthResponse = BackendAuthResponse

export async function loginRequest(payload: LoginPayload): Promise<AuthResponse> {
  const response = await authAxiosInstance.post<AuthResponse>('/auth/login', payload)
  return response.data
}

export async function registerRequest(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await authAxiosInstance.post<AuthResponse>('/auth/register', payload)
  return response.data
}

export async function getCurrentUserRequest(): Promise<User> {
  const response = await authAxiosInstance.get<User>('/auth/me')
  return response.data
}

export async function refreshAccessTokenRequest(refreshToken: string): Promise<AuthResponse> {
  const response = await authAxiosInstance.post<AuthResponse>('/auth/refresh', { refreshToken })
  return response.data
}

export async function logoutRequest(refreshToken: string): Promise<void> {
  await authAxiosInstance.post('/auth/logout', { refreshToken })
}

export async function updateUserRequest(
  _userId: number,
  payload: Pick<User, 'email' | 'name' | 'phone'>,
): Promise<User> {
  const response = await authAxiosInstance.patch<User>('/auth/me', payload)
  return response.data
}
