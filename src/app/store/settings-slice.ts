import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store/store.ts'
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

export const selectSettings = (state: RootState) => state.settings
export const selectGlobalErrorMessage = (state: RootState) => state.settings.errorMessage
export const selectIsGlobalLoading = (state: RootState) => state.settings.isGlobalLoading
