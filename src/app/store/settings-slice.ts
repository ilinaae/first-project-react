import { createSlice } from '@reduxjs/toolkit'
import type { SettingsState } from '@/types/entities.ts'

const initialState: SettingsState = {
  errorMessage: null,
  isGlobalLoading: false,
}

const settingsSlice = createSlice({
  initialState,
  name: 'settings',
  reducers: {
    hideGlobalError: (state) => {
      state.errorMessage = null
    },
    setGlobalError: (state, action: { payload: string; type: string }) => {
      state.errorMessage = action.payload
    },
    setGlobalLoading: (state, action: { payload: boolean; type: string }) => {
      state.isGlobalLoading = action.payload
    },
  },
})

export const { hideGlobalError, setGlobalError, setGlobalLoading } =
  settingsSlice.actions
export const settingsReducer = settingsSlice.reducer



