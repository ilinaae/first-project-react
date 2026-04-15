import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { Link, NavLink } from 'react-router-dom'
import { ROUTES } from '@/constants/routes.ts'
import { useAppDispatch, useAppSelector } from '@/store/hooks.ts'
import { logoutUser } from '@/store/user-slice.ts'
import { Button } from '@/ui/button/button.tsx'

const guestActions = [
  { label: 'Войти', to: ROUTES.login },
  { label: 'Регистрация', to: ROUTES.register },
]

const publicLinks = [
  { label: 'Букеты', to: ROUTES.catalogBouquets },
  { label: 'Цветы', to: ROUTES.catalogFlowers },
  { label: 'Подарки', to: ROUTES.catalogGifts },
]

const memberLinks = [
  { label: 'Конструктор', to: ROUTES.builder },
  { label: 'Корзина', to: ROUTES.cart },
  { label: 'Профиль', to: ROUTES.profile },
]

const COMPACT_ENTER_SCROLL_Y = 140
const COMPACT_EXIT_SCROLL_Y = 12

export function SiteHeader() {
  const dispatch = useAppDispatch()
  const { isAuthorized, profile } = useAppSelector((state) => state.user)
  const roleLabel = profile?.role === 'admin' ? 'администратор' : 'пользователь'
  const [isCompact, setIsCompact] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY

      setIsCompact((currentValue) => {
        if (!currentValue && scrollPosition >= COMPACT_ENTER_SCROLL_Y) {
          return true
        }

        if (currentValue && scrollPosition <= COMPACT_EXIT_SCROLL_Y) {
          return false
        }

        return currentValue
      })
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <header className={clsx('site-header', isCompact && 'site-header--compact')}>
      <div className="container site-header__inner">
        <div className="site-header__brand">
          <Link className="site-brand" to={ROUTES.home}>
            Flora Boutique
          </Link>
          <p className="site-brand__tag">
            Авторские букеты, подарки и удобный конструктор.
          </p>
        </div>

        <nav className="site-nav" aria-label="Основная навигация">
          {publicLinks.map((link) => (
            <NavLink
              key={link.to}
              className={({ isActive }) =>
                isActive ? 'site-nav__link is-active' : 'site-nav__link'
              }
              to={link.to}
            >
              {link.label}
            </NavLink>
          ))}

          {isAuthorized
            ? memberLinks.map((link) => (
                <NavLink
                  key={link.to}
                  className={({ isActive }) =>
                    isActive ? 'site-nav__link is-active' : 'site-nav__link'
                  }
                  to={link.to}
                >
                  {link.label}
                </NavLink>
              ))
            : null}

          {profile?.role === 'admin' ? (
            <NavLink
              className={({ isActive }) =>
                isActive ? 'site-nav__link is-active' : 'site-nav__link'
              }
              to={ROUTES.adminProducts}
            >
              Админ-панель
            </NavLink>
          ) : null}
        </nav>

        <div className="site-actions">
          {isAuthorized ? (
            <>
              <div className="site-user-chip">
                <span className="site-user-chip__name">{profile?.name}</span>
                <span className="site-user-chip__role">{roleLabel}</span>
              </div>
              <Button onClick={() => void dispatch(logoutUser())} variant="ghost">
                Выйти
              </Button>
            </>
          ) : (
            guestActions.map((action) => (
              <Link
                key={action.to}
                className={
                  action.to === ROUTES.login
                    ? 'site-actions__link site-actions__link--ghost'
                    : 'site-actions__link'
                }
                to={action.to}
              >
                {action.label}
              </Link>
            ))
          )}
        </div>
      </div>
    </header>
  )
}
