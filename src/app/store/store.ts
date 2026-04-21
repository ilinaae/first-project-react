import { configureStore } from '@reduxjs/toolkit'
import { adminReducer } from '@/app/store/admin-slice.ts'
import { cartReducer } from '@/app/store/cart-slice.ts'
import { ordersReducer } from '@/app/store/orders-slice.ts'
import { productsReducer } from '@/app/store/products-slice.ts'
import { settingsReducer } from '@/app/store/settings-slice.ts'
import { userReducer } from '@/app/store/user-slice.ts'

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



