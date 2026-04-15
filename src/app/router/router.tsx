import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/components/layout/app-layout.tsx'
import { AuthWrapper } from '@/components/wrappers/auth-wrapper.tsx'
import { CommonWrapper } from '@/components/wrappers/common-wrapper.tsx'
import { ROUTES } from '@/constants/routes.ts'
import { AdminOrdersPage } from '@/pages/admin-orders/admin-orders-page.tsx'
import { AdminProductsPage } from '@/pages/admin-products/admin-products-page.tsx'
import { BuilderPage } from '@/pages/builder/builder-page.tsx'
import { CartPage } from '@/pages/cart/cart-page.tsx'
import { CatalogPage } from '@/pages/catalog/catalog-page.tsx'
import { CheckoutPage } from '@/pages/checkout/checkout-page.tsx'
import { DashboardPage } from '@/pages/dashboard/dashboard-page.tsx'
import { HomePage } from '@/pages/home/home-page.tsx'
import { LoginPage } from '@/pages/login/login-page.tsx'
import { NotFoundPage } from '@/pages/not-found/not-found-page.tsx'
import { ProfilePage } from '@/pages/profile/profile-page.tsx'
import { RegisterPage } from '@/pages/register/register-page.tsx'

export const appRouter = createBrowserRouter([
  {
    element: <CommonWrapper />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: ROUTES.home,
            element: <HomePage />,
          },
          {
            path: ROUTES.login,
            element: <LoginPage />,
          },
          {
            path: ROUTES.register,
            element: <RegisterPage />,
          },
          {
            path: ROUTES.catalogBouquets,
            element: <CatalogPage category="bouquet" />,
          },
          {
            path: ROUTES.catalogFlowers,
            element: <CatalogPage category="flower" />,
          },
          {
            path: ROUTES.catalogGifts,
            element: <CatalogPage category="gift" />,
          },
          {
            element: <AuthWrapper />,
            children: [
              {
                path: ROUTES.dashboard,
                element: <DashboardPage />,
              },
              {
                path: ROUTES.profile,
                element: <ProfilePage />,
              },
              {
                path: ROUTES.builder,
                element: <BuilderPage />,
              },
              {
                path: ROUTES.cart,
                element: <CartPage />,
              },
              {
                path: ROUTES.checkout,
                element: <CheckoutPage />,
              },
            ],
          },
          {
            element: <AuthWrapper requireAdmin />,
            children: [
              {
                path: ROUTES.adminProducts,
                element: <AdminProductsPage />,
              },
              {
                path: ROUTES.adminOrders,
                element: <AdminOrdersPage />,
              },
            ],
          },
          {
            path: ROUTES.notFound,
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
])
