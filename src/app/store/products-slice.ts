import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { getProductsRequest } from '@/services/api/products-api.ts'
import type { ProductCategory, ProductsState } from '@/types/entities.ts'
import { hideGlobalError, setGlobalError } from '@/app/store/settings-slice.ts'
import { getAuthErrorMessage } from '@/utils/get-auth-error-message.ts'

const initialState: ProductsState = {
  currentCategory: 'bouquet',
  items: [],
  searchTerm: '',
  showOnlyAvailable: false,
  status: 'idle',
}

export const fetchProducts = createAsyncThunk<
  { category: ProductCategory; items: ProductsState['items'] },
  ProductCategory,
  { rejectValue: string }
>('products/fetchProducts', async (category, { dispatch, rejectWithValue }) => {
  dispatch(hideGlobalError())
  dispatch(setProductsStatus('loading'))

  try {
    const items = await getProductsRequest(category)
    dispatch(setProductsData({ category, items }))
    dispatch(setProductsStatus('succeeded'))
    return { category, items }
  } catch (error) {
    const message = getAuthErrorMessage(error)
    dispatch(setGlobalError(message))
    dispatch(setProductsStatus('failed'))
    return rejectWithValue(message)
  }
})

const productsSlice = createSlice({
  initialState,
  name: 'products',
  reducers: {
    setProductsData: (
      state,
      action: PayloadAction<{ category: ProductCategory; items: ProductsState['items'] }>,
    ) => {
      state.currentCategory = action.payload.category
      state.items = action.payload.items
    },
    setProductsStatus: (
      state,
      action: PayloadAction<ProductsState['status']>,
    ) => {
      state.status = action.payload
    },
    setCurrentCategory: (
      state,
      action: PayloadAction<ProductCategory>,
    ) => {
      state.currentCategory = action.payload
    },
    resetCatalogFilters: (state) => {
      state.searchTerm = ''
      state.showOnlyAvailable = false
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
    },
    setShowOnlyAvailable: (state, action: PayloadAction<boolean>) => {
      state.showOnlyAvailable = action.payload
    },
  },
})

export const {
  resetCatalogFilters,
  setCurrentCategory,
  setProductsData,
  setProductsStatus,
  setSearchTerm,
  setShowOnlyAvailable,
} = productsSlice.actions
export const productsReducer = productsSlice.reducer




