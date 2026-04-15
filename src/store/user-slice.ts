import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { LoginPayload, RegisterPayload, User, UserState } from '@/types/entities.ts'
import {
  getCurrentUserByTokenRequest,
  getUsersByEmail,
  loginRequest,
  refreshAccessTokenRequest,
  registerRequest,
  updateUserRequest,
} from '@/services/api/auth-api.ts'
import { isTokenExpired } from '@/utils/auth-tokens.ts'
import { resetCartState } from '@/store/cart-slice.ts'
import { resetOrdersState } from '@/store/orders-slice.ts'
import { hideGlobalError, setGlobalError, setGlobalLoading } from '@/store/settings-slice.ts'
import { getAuthErrorMessage } from '@/utils/get-auth-error-message.ts'
import {
  clearStoredAuth,
  getStoredAccessToken,
  getStoredRefreshToken,
  setStoredAccessToken,
  setStoredRefreshToken,
  setStoredUser,
} from '@/utils/storage.ts'

const storedAccessToken = getStoredAccessToken()
const storedRefreshToken = getStoredRefreshToken()

const initialState: UserState = {
  accessToken: storedAccessToken,
  authStatus: 'idle',
  isAuthorized: false,
  isSessionResolved: storedAccessToken === null && storedRefreshToken === null,
  profile: null,
  refreshToken: storedRefreshToken,
}

export const restoreSession = createAsyncThunk<
  User | null,
  void,
  { rejectValue: string }
>('user/restoreSession', async (_, { dispatch, rejectWithValue }) => {
  let accessToken = getStoredAccessToken()
  const refreshToken = getStoredRefreshToken()

  if (!accessToken && !refreshToken) {
    dispatch(setSessionResolved(true))
    return null
  }

  dispatch(hideGlobalError())
  dispatch(setGlobalLoading(true))
  dispatch(setAuthStatus('loading'))

  try {
    if ((!accessToken || isTokenExpired(accessToken)) && refreshToken) {
      accessToken = await refreshAccessTokenRequest(refreshToken)
      setStoredAccessToken(accessToken)
    }

    if (!accessToken) {
      throw new Error('Access token missing')
    }

    const user = await getCurrentUserByTokenRequest(accessToken)
    setStoredUser(user)
    dispatch(
      setUserSession({
        accessToken,
        refreshToken,
        user,
      }),
    )
    dispatch(setSessionResolved(true))
    return user
  } catch (error) {
    const message = getAuthErrorMessage(error)
    clearStoredAuth()
    dispatch(setGlobalError(message))
    dispatch(clearUserState())
    dispatch(setSessionResolved(true))
    return rejectWithValue(message)
  } finally {
    dispatch(setGlobalLoading(false))
  }
})

export const loginUser = createAsyncThunk<
  User,
  LoginPayload,
  { rejectValue: string }
>('user/loginUser', async (payload, { dispatch, rejectWithValue }) => {
  dispatch(hideGlobalError())
  dispatch(setGlobalLoading(true))
  dispatch(setAuthStatus('loading'))

  try {
    const authData = await loginRequest(payload)

    if (!authData) {
      const message = 'Неверный email или пароль.'
      dispatch(setGlobalError(message))
      dispatch(setAuthStatus('failed'))
      return rejectWithValue(message)
    }

    setStoredAccessToken(authData.accessToken)
    setStoredRefreshToken(authData.refreshToken)
    setStoredUser(authData.user)
    dispatch(setUserSession(authData))
    dispatch(setSessionResolved(true))

    return authData.user
  } catch (error) {
    const message = getAuthErrorMessage(error)
    dispatch(setGlobalError(message))
    dispatch(setAuthStatus('failed'))
    return rejectWithValue(message)
  } finally {
    dispatch(setGlobalLoading(false))
  }
})

export const registerUser = createAsyncThunk<
  User,
  RegisterPayload,
  { rejectValue: string }
>('user/registerUser', async (payload, { dispatch, rejectWithValue }) => {
  dispatch(hideGlobalError())
  dispatch(setGlobalLoading(true))
  dispatch(setAuthStatus('loading'))

  try {
    const existingUsers = await getUsersByEmail(payload.email)

    if (existingUsers.length > 0) {
      const message = 'Пользователь с такими данными уже существует.'
      dispatch(setGlobalError(message))
      dispatch(setAuthStatus('failed'))
      return rejectWithValue(message)
    }

    const authData = await registerRequest(payload)
    setStoredAccessToken(authData.accessToken)
    setStoredRefreshToken(authData.refreshToken)
    setStoredUser(authData.user)
    dispatch(setUserSession(authData))
    dispatch(setSessionResolved(true))

    return authData.user
  } catch (error) {
    const message = getAuthErrorMessage(error)
    dispatch(setGlobalError(message))
    dispatch(setAuthStatus('failed'))
    return rejectWithValue(message)
  } finally {
    dispatch(setGlobalLoading(false))
  }
})

export const updateUserProfile = createAsyncThunk<
  User,
  Pick<User, 'email' | 'name' | 'phone'> & { userId: number },
  { rejectValue: string }
>('user/updateUserProfile', async ({ userId, ...payload }, { dispatch, getState, rejectWithValue }) => {
  dispatch(hideGlobalError())
  dispatch(setGlobalLoading(true))
  dispatch(setAuthStatus('loading'))

  try {
    const user = await updateUserRequest(userId, payload)
    const currentUserState = (getState() as { user: UserState }).user

    setStoredUser(user)
    if (currentUserState.accessToken || currentUserState.refreshToken) {
      dispatch(
        setUserSession({
          accessToken: currentUserState.accessToken,
          refreshToken: currentUserState.refreshToken,
          user,
        }),
      )
    } else {
      dispatch(setAuthStatus('succeeded'))
    }

    return user
  } catch (error) {
    const message = getAuthErrorMessage(error)
    dispatch(setGlobalError(message))
    dispatch(setAuthStatus('failed'))
    return rejectWithValue(message)
  } finally {
    dispatch(setGlobalLoading(false))
  }
})

export const logoutUser = createAsyncThunk('user/logoutUser', async (_, { dispatch }) => {
  dispatch(hideGlobalError())
  clearStoredAuth()
  dispatch(resetCartState())
  dispatch(resetOrdersState())
  dispatch(clearUserState())
  dispatch(setSessionResolved(true))
})

const userSlice = createSlice({
  initialState,
  name: 'user',
  reducers: {
    clearUserState: (state) => {
      state.accessToken = null
      state.authStatus = 'idle'
      state.isAuthorized = false
      state.profile = null
      state.refreshToken = null
    },
    setAuthStatus: (state, action: PayloadAction<UserState['authStatus']>) => {
      state.authStatus = action.payload
    },
    setSessionResolved: (state, action: PayloadAction<boolean>) => {
      state.isSessionResolved = action.payload
    },
    setUserSession: (
      state,
      action: PayloadAction<{
        accessToken: string | null
        refreshToken: string | null
        user: User
      }>,
    ) => {
      state.accessToken = action.payload.accessToken
      state.authStatus = 'succeeded'
      state.isAuthorized = true
      state.profile = action.payload.user
      state.refreshToken = action.payload.refreshToken
    },
  },
})

export const { clearUserState, setAuthStatus, setSessionResolved, setUserSession } =
  userSlice.actions
export const userReducer = userSlice.reducer
