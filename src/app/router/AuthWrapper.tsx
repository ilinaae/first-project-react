import { type FC, type ReactNode, useEffect } from 'react'
import { matchPath, Navigate, useLocation } from 'react-router-dom'
import { ROUTES } from '@/app/router/routes.ts'
import {
  restoreSession,
  selectIsAuthorized,
  selectIsSessionResolved,
} from '@/app/store/user-slice.ts'
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks.ts'
import { getStoredRefreshToken, getStoredUser } from '@/utils/storage.ts'

interface AuthWrapperProps {
  children: ReactNode
}

const OPEN_PATHS = [
  ROUTES.home,
  ROUTES.login,
  ROUTES.register,
  ROUTES.catalogBouquets,
  ROUTES.catalogFlowers,
  ROUTES.catalogGifts,
]

const GUEST_ONLY_PATHS = [ROUTES.login, ROUTES.register]

function matchesPath(pathname: string, patterns: string[]) {
  return patterns.some((pattern) => Boolean(matchPath({ end: true, path: pattern }, pathname)))
}

export const AuthWrapper: FC<AuthWrapperProps> = ({ children }) => {
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(selectIsAuthorized)
  const isSessionResolved = useAppSelector(selectIsSessionResolved)
  const { pathname } = useLocation()
  const storedUser = getStoredUser()
  const refreshToken = getStoredRefreshToken()
  const hasSession = isAuthenticated || storedUser !== null || Boolean(refreshToken)

  useEffect(() => {
    if (!isSessionResolved && refreshToken) {
      // Восстанавливаем сессию до рендера защищенных маршрутов
      void dispatch(restoreSession())
    }
  }, [dispatch, isSessionResolved, refreshToken])

  if (!isSessionResolved && refreshToken) {
    return (
      <section className="page-section">
        <div className="container">
          <div className="content-card">
            <h1>Проверяем сессию</h1>
          </div>
        </div>
      </section>
    )
  }

  const isGuestOnlyPath = matchesPath(pathname, GUEST_ONLY_PATHS)
  const isOpenPath = matchesPath(pathname, OPEN_PATHS)

  // Авторизованного пользователя уводим с login и register на dashboard
  if (hasSession && isGuestOnlyPath) {
    return <Navigate replace to={ROUTES.dashboard} />
  }

  // Неавторизованного пользователя не пускаем в закрытые разделы
  if (!hasSession && !isOpenPath) {
    return <Navigate replace to={ROUTES.login} />
  }

  return <>{children}</>
}
