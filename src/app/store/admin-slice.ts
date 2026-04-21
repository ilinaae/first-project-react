import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store/store.ts'

type AdminState = {
  activeSection: 'products' | 'orders'
}

const initialState: AdminState = {
  activeSection: 'products',
}

const adminSlice = createSlice({
  initialState,
  name: 'admin',
  reducers: {
    setAdminSection: (
      state,
      action: { payload: AdminState['activeSection']; type: string },
    ) => {
      state.activeSection = action.payload
    },
  },
})

export const { setAdminSection } = adminSlice.actions
export const adminReducer = adminSlice.reducer

export const selectAdmin = (state: RootState) => state.admin
export const selectAdminSection = (state: RootState) => state.admin.activeSection
