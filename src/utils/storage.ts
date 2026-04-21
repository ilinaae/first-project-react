import type { User } from '@/types/entities.ts'

const ACCESS_TOKEN_STORAGE_KEY = 'flora-boutique-access-token'
const REFRESH_TOKEN_STORAGE_KEY = 'flora-boutique-refresh-token'
const USER_STORAGE_KEY = 'flora-boutique-user'

export function getStoredUser() {
  const rawValue = window.localStorage.getItem(USER_STORAGE_KEY)

  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue) as User
  } catch {
    return null
  }
}

export function setStoredUser(user: User) {
  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
}

export function clearStoredUser() {
  window.localStorage.removeItem(USER_STORAGE_KEY)
}

export function getStoredAccessToken() {
  return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
}

export function setStoredAccessToken(token: string) {
  window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token)
}

export function clearStoredAccessToken() {
  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
}

export function getStoredRefreshToken() {
  return window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)
}

export function setStoredRefreshToken(token: string) {
  window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token)
}

export function clearStoredRefreshToken() {
  window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
}

export function clearStoredAuth() {
  clearStoredUser()
  clearStoredAccessToken()
  clearStoredRefreshToken()
}
