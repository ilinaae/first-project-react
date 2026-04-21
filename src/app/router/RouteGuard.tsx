import type { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { ROUTES } from '@/app/router/routes.ts'
import type { RouteAccess } from '@/app/router/routeConfig.tsx'
import { useAppSelector } from '@/hooks/storeHooks.ts'

type RouteGuardProps = PropsWithChildren<{
  access: RouteAccess
}>

export function RouteGuard({ access, children }: RouteGuardProps) {
  const location = useLocation()
  const { isAuthorized, isSessionResolved, profile } = useAppSelector((state) => state.user)

  if (access.kind === 'public') {
    return <>{children}</>
  }

  if (!isSessionResolved) {
    return null
  }

  if (access.kind === 'guest-only') {
    if (isAuthorized && profile) {
      return <Navigate replace to={profile.role === 'admin' ? ROUTES.adminProducts : ROUTES.dashboard} />
    }

    return <>{children}</>
  }

  if (!isAuthorized || !profile) {
    return <Navigate replace state={{ from: location.pathname }} to={ROUTES.login} />
  }

  if (access.kind === 'role-based' && !access.roles.includes(profile.role)) {
    return <Navigate replace to={ROUTES.dashboard} />
  }

  return <>{children}</>
}



