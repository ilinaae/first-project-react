import { axiosInstance } from '@/services/api/axios-instance.ts'
import type { LoginPayload, RegisterPayload, User } from '@/types/entities.ts'
type AuthResponse = {
  accessToken: string
  refreshToken: string
  user: User
}
import {
  getUserIdFromToken,
  issueAccessToken,
  issueRefreshToken,
  refreshAccessTokenByRefreshToken,
} from '@/utils/auth-tokens.ts'

export async function loginRequest(payload: LoginPayload): Promise<AuthResponse | null> {
  const response = await axiosInstance.get<User[]>('/users', {
    params: {
      email: payload.email,
      password: payload.password,
    },
  })

  const user = response.data[0]

  if (!user) {
    return null
  }

  return {
    accessToken: issueAccessToken(user.id),
    refreshToken: issueRefreshToken(user.id),
    user,
  }
}

export async function getUsersByEmail(email: string) {
  const response = await axiosInstance.get<User[]>('/users', {
    params: {
      email,
    },
  })

  return response.data
}

export async function registerRequest(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await axiosInstance.post<User>('/users', {
    ...payload,
    createdAt: new Date().toISOString(),
    role: 'user',
  })

  return {
    accessToken: issueAccessToken(response.data.id),
    refreshToken: issueRefreshToken(response.data.id),
    user: response.data,
  }
}

export async function getCurrentUserByTokenRequest(accessToken: string) {
  const userId = getUserIdFromToken(accessToken, 'access')
  const response = await axiosInstance.get<User>(`/users/${userId}`)

  return response.data
}

export async function refreshAccessTokenRequest(refreshToken: string) {
  return refreshAccessTokenByRefreshToken(refreshToken)
}

export async function updateUserRequest(
  userId: number,
  payload: Pick<User, 'email' | 'name' | 'phone'>,
) {
  const currentUserResponse = await axiosInstance.get<User>(`/users/${userId}`)

  const response = await axiosInstance.put<User>(`/users/${userId}`, {
    ...currentUserResponse.data,
    ...payload,
  })

  return response.data
}
