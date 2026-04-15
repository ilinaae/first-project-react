import axios from 'axios'
import { isTokenExpired, refreshAccessTokenByRefreshToken } from '@/utils/auth-tokens.ts'
import {
  clearStoredAuth,
  getStoredAccessToken,
  getStoredRefreshToken,
  setStoredAccessToken,
} from '@/utils/storage.ts'

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 10000,
})

axiosInstance.interceptors.request.use((config) => {
  const accessToken = getStoredAccessToken()
  const refreshToken = getStoredRefreshToken()
  let nextAccessToken = accessToken

  if ((!nextAccessToken || isTokenExpired(nextAccessToken)) && refreshToken) {
    try {
      nextAccessToken = refreshAccessTokenByRefreshToken(refreshToken)
      setStoredAccessToken(nextAccessToken)
    } catch {
      clearStoredAuth()
      nextAccessToken = null
    }
  }

  if (nextAccessToken && !isTokenExpired(nextAccessToken)) {
    config.headers.Authorization = `Bearer ${nextAccessToken}`
  }

  return config
})
