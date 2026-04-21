import type { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'
import { ROUTES } from '@/app/router/routes.ts'
import { useAppSelector } from '@/hooks/storeHooks.ts'

type RouteGuardProps = PropsWithChildren<{
  requiresAdmin?: boolean
}>

export function RouteGuard({ requiresAdmin = false, children }: RouteGuardProps) {
  const { isSessionResolved, profile } = useAppSelector((state) => state.user)

  if (!isSessionResolved) {
    return null
  }

  // Защищаем admin-маршруты по роли
  if (requiresAdmin && profile?.role !== 'admin') {
    return <Navigate replace to={ROUTES.dashboard} />
  }

  return <>{children}</>
}
