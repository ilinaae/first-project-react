import type { ReactElement } from 'react'
import { AdminOrdersPage } from '@/pages/admin-orders-page.tsx'
import { AdminProductsPage } from '@/pages/admin-products-page.tsx'
import { BuilderPage } from '@/pages/builder-page.tsx'
import { CartPage } from '@/pages/cart-page.tsx'
import { CatalogPage } from '@/pages/catalog-page.tsx'
import { CheckoutPage } from '@/pages/checkout-page.tsx'
import { DashboardPage } from '@/pages/dashboard-page.tsx'
import { HomePage } from '@/pages/home-page.tsx'
import { LoginPage } from '@/pages/login-page.tsx'
import { NotFoundPage } from '@/pages/not-found-page.tsx'
import { ProfilePage } from '@/pages/profile-page.tsx'
import { RegisterPage } from '@/pages/register-page.tsx'
import type { UserRole } from '@/types/entities.ts'
import { ROUTES } from '@/app/router/routes.ts'

export type RouteAccess =
  | { kind: 'public' }
  | { kind: 'guest-only' }
  | { kind: 'authenticated' }
  | { kind: 'role-based'; roles: UserRole[] }

export type AppRouteDefinition = {
  path: string
  element: ReactElement
  access: RouteAccess
}

export const appRoutes: AppRouteDefinition[] = [
  {
    path: ROUTES.home,
    element: <HomePage />,
    access: { kind: 'public' },
  },
  {
    path: ROUTES.login,
    element: <LoginPage />,
    access: { kind: 'guest-only' },
  },
  {
    path: ROUTES.register,
    element: <RegisterPage />,
    access: { kind: 'guest-only' },
  },
  {
    path: ROUTES.catalogBouquets,
    element: <CatalogPage category="bouquet" />,
    access: { kind: 'public' },
  },
  {
    path: ROUTES.catalogFlowers,
    element: <CatalogPage category="flower" />,
    access: { kind: 'public' },
  },
  {
    path: ROUTES.catalogGifts,
    element: <CatalogPage category="gift" />,
    access: { kind: 'public' },
  },
  {
    path: ROUTES.dashboard,
    element: <DashboardPage />,
    access: { kind: 'authenticated' },
  },
  {
    path: ROUTES.profile,
    element: <ProfilePage />,
    access: { kind: 'authenticated' },
  },
  {
    path: ROUTES.builder,
    element: <BuilderPage />,
    access: { kind: 'authenticated' },
  },
  {
    path: ROUTES.cart,
    element: <CartPage />,
    access: { kind: 'authenticated' },
  },
  {
    path: ROUTES.checkout,
    element: <CheckoutPage />,
    access: { kind: 'authenticated' },
  },
  {
    path: ROUTES.adminProducts,
    element: <AdminProductsPage />,
    access: { kind: 'role-based', roles: ['admin'] },
  },
  {
    path: ROUTES.adminOrders,
    element: <AdminOrdersPage />,
    access: { kind: 'role-based', roles: ['admin'] },
  },
  {
    path: ROUTES.notFound,
    element: <NotFoundPage />,
    access: { kind: 'public' },
  },
]




