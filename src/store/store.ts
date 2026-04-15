import { configureStore } from '@reduxjs/toolkit'
import { adminReducer } from '@/store/admin-slice.ts'
import { cartReducer } from '@/store/cart-slice.ts'
import { ordersReducer } from '@/store/orders-slice.ts'
import { productsReducer } from '@/store/products-slice.ts'
import { settingsReducer } from '@/store/settings-slice.ts'
import { userReducer } from '@/store/user-slice.ts'

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    cart: cartReducer,
    orders: ordersReducer,
    products: productsReducer,
    settings: settingsReducer,
    user: userReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
