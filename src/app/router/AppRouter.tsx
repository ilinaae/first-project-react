import { Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/app-layout.tsx'
import { RouteGuard } from '@/app/router/RouteGuard.tsx'
import { appRoutes } from '@/app/router/routeConfig.tsx'

export function AppRouter() {
  return (
    <AppLayout>
      <Routes>
        {appRoutes.map((route) => (
          <Route
            key={route.path}
            element={<RouteGuard access={route.access}>{route.element}</RouteGuard>}
            path={route.path}
          />
        ))}
      </Routes>
    </AppLayout>
  )
}




