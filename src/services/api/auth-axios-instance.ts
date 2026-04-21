import axios, { type InternalAxiosRequestConfig } from 'axios'
import type { User } from '@/types/entities.ts'
import {
  clearStoredAuth,
  getStoredAccessToken,
  getStoredRefreshToken,
  setStoredAccessToken,
  setStoredRefreshToken,
  setStoredUser,
} from '@/utils/storage.ts'

export type BackendAuthResponse = {
  accessToken: string
  refreshToken: string
  user: User
}

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

const AUTH_API_BASE_URL = 'http://127.0.0.1:8000/api/v1'

const refreshClient = axios.create({
  baseURL: AUTH_API_BASE_URL,
  timeout: 10000,
})

export const authAxiosInstance = axios.create({
  baseURL: AUTH_API_BASE_URL,
  timeout: 10000,
})

authAxiosInstance.interceptors.request.use((config) => {
  const accessToken = getStoredAccessToken()

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

authAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined
    const refreshToken = getStoredRefreshToken()
    const requestUrl = originalRequest?.url ?? ''
    const isRefreshRequest = requestUrl.includes('/auth/refresh')
    const isLoginRequest = requestUrl.includes('/auth/login')
    const isRegisterRequest = requestUrl.includes('/auth/register')
    const isLogoutRequest = requestUrl.includes('/auth/logout')

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      !refreshToken ||
      isRefreshRequest ||
      isLoginRequest ||
      isRegisterRequest ||
      isLogoutRequest
    ) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      const response = await refreshClient.post<BackendAuthResponse>('/auth/refresh', {
        refreshToken,
      })

      setStoredAccessToken(response.data.accessToken)
      setStoredRefreshToken(response.data.refreshToken)
      setStoredUser(response.data.user)
      originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`

      return authAxiosInstance(originalRequest)
    } catch (refreshError) {
      clearStoredAuth()
      return Promise.reject(refreshError)
    }
  },
)




