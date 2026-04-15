import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROUTES } from '@/constants/routes.ts'
import { useAppSelector } from '@/store/hooks.ts'

type AuthWrapperProps = {
  requireAdmin?: boolean
}

export function AuthWrapper({ requireAdmin = false }: AuthWrapperProps) {
  const location = useLocation()
  const { isAuthorized, isSessionResolved, profile } = useAppSelector((state) => state.user)

  if (!isSessionResolved) {
    return null
  }

  if (!isAuthorized) {
    return <Navigate replace state={{ from: location.pathname }} to={ROUTES.login} />
  }

  if (requireAdmin && profile?.role !== 'admin') {
    return <Navigate replace to={ROUTES.dashboard} />
  }

  return <Outlet />
}
