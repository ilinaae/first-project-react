import { Route, Routes } from 'react-router-dom'
import { ROUTES } from '@/app/router/routes.ts'
import { RouteGuard } from '@/app/router/RouteGuard.tsx'
import { AppLayout } from '@/components/layout/app-layout.tsx'
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

export function AppRouter() {
  return (
    <AppLayout>
      <Routes>
        <Route element={<HomePage />} path={ROUTES.home} />
        <Route element={<LoginPage />} path={ROUTES.login} />
        <Route element={<RegisterPage />} path={ROUTES.register} />
        <Route element={<CatalogPage category="bouquet" />} path={ROUTES.catalogBouquets} />
        <Route element={<CatalogPage category="flower" />} path={ROUTES.catalogFlowers} />
        <Route element={<CatalogPage category="gift" />} path={ROUTES.catalogGifts} />
        <Route element={<DashboardPage />} path={ROUTES.dashboard} />
        <Route element={<ProfilePage />} path={ROUTES.profile} />
        <Route element={<BuilderPage />} path={ROUTES.builder} />
        <Route element={<CartPage />} path={ROUTES.cart} />
        <Route element={<CheckoutPage />} path={ROUTES.checkout} />
        <Route
          element={
            <RouteGuard requiresAdmin>
              <AdminProductsPage />
            </RouteGuard>
          }
          path={ROUTES.adminProducts}
        />
        <Route
          element={
            <RouteGuard requiresAdmin>
              <AdminOrdersPage />
            </RouteGuard>
          }
          path={ROUTES.adminOrders}
        />
        <Route element={<NotFoundPage />} path={ROUTES.notFound} />
      </Routes>
    </AppLayout>
  )
}
