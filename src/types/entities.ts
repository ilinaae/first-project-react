export type UserRole = 'admin' | 'user'
export type ProductCategory = 'bouquet' | 'flower' | 'gift'
export type DeliveryMethod = 'delivery' | 'pickup'
export type OrderStatus =
  | 'new'
  | 'confirmed'
  | 'assembling'
  | 'delivering'
  | 'completed'
  | 'cancelled'

export type User = {
  createdAt: string
  email: string
  id: number
  name: string
  password: string
  phone: string
  role: UserRole
}

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  email: string
  name: string
  password: string
  phone: string
}

export type UserState = {
  accessToken: string | null
  authStatus: 'failed' | 'idle' | 'loading' | 'succeeded'
  isAuthorized: boolean
  isSessionResolved: boolean
  profile: User | null
  refreshToken: string | null
}

export type SettingsState = {
  errorMessage: string | null
  isGlobalLoading: boolean
}

export type Product = {
  category: ProductCategory
  description: string
  id: number
  image: string
  isAvailable: boolean
  price: number
  stock: number
  tags: string[]
  title: string
}

export type ProductFormValues = {
  category: ProductCategory
  description: string
  image: string
  isAvailable: boolean
  price: number
  stock: number
  title: string
}

export type ProductsState = {
  currentCategory: ProductCategory
  items: Product[]
  searchTerm: string
  showOnlyAvailable: boolean
  status: 'failed' | 'idle' | 'loading' | 'succeeded'
}

export type CartItem = {
  details?: string[]
  id: string
  image: string
  price: number
  quantity: number
  title: string
  type: 'customBouquet' | 'product'
}

export type PackagingOption = {
  id: number
  name: string
  price: number
}

export type ExtraService = {
  id: number
  name: string
  price: number
}

export type CartState = {
  items: CartItem[]
  total: number
}

export type CheckoutPayload = {
  address?: string
  comment?: string
  deliveryMethod: DeliveryMethod
  items: CartItem[]
  totalPrice: number
  userId: number
}

export type Order = {
  address?: string
  comment?: string
  createdAt: string
  deliveryMethod: DeliveryMethod
  id: number
  items: CartItem[]
  status: OrderStatus
  totalPrice: number
  userId: number
}
