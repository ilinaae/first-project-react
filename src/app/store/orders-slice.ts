import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { createOrderRequest, getOrdersByUserIdRequest } from '@/services/api/orders-api.ts'
import { clearCart } from '@/app/store/cart-slice.ts'
import { hideGlobalError, setGlobalError, setGlobalLoading } from '@/app/store/settings-slice.ts'
import type { CheckoutPayload, Order } from '@/types/entities.ts'
import { getAuthErrorMessage } from '@/utils/get-auth-error-message.ts'

type OrdersState = {
  adminOrders: Order[]
  userOrders: Order[]
}

const initialState: OrdersState = {
  adminOrders: [],
  userOrders: [],
}

export const createOrder = createAsyncThunk<
  Order,
  CheckoutPayload,
  { rejectValue: string }
>('orders/createOrder', async (payload, { dispatch, rejectWithValue }) => {
  dispatch(hideGlobalError())
  dispatch(setGlobalLoading(true))

  try {
    const order = await createOrderRequest(payload)
    dispatch(clearCart())
    dispatch(prependUserOrder(order))
    return order
  } catch (error) {
    const message = getAuthErrorMessage(error)
    dispatch(setGlobalError(message))
    return rejectWithValue(message)
  } finally {
    dispatch(setGlobalLoading(false))
  }
})

export const fetchUserOrders = createAsyncThunk<
  Order[],
  number,
  { rejectValue: string }
>('orders/fetchUserOrders', async (userId, { dispatch, rejectWithValue }) => {
  dispatch(hideGlobalError())
  dispatch(setGlobalLoading(true))

  try {
    const orders = await getOrdersByUserIdRequest(userId)
    dispatch(setUserOrders(orders))
    return orders
  } catch (error) {
    const message = getAuthErrorMessage(error)
    dispatch(setGlobalError(message))
    return rejectWithValue(message)
  } finally {
    dispatch(setGlobalLoading(false))
  }
})

const ordersSlice = createSlice({
  initialState,
  name: 'orders',
  reducers: {
    prependUserOrder: (state, action: PayloadAction<Order>) => {
      state.userOrders = [action.payload, ...state.userOrders]
    },
    resetOrdersState: () => initialState,
    setAdminOrders: (state, action: PayloadAction<Order[]>) => {
      state.adminOrders = action.payload
    },
    setUserOrders: (state, action: PayloadAction<Order[]>) => {
      state.userOrders = action.payload
    },
  },
})

export const { prependUserOrder, resetOrdersState, setAdminOrders, setUserOrders } =
  ordersSlice.actions
export const ordersReducer = ordersSlice.reducer



