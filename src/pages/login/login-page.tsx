import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AuthCard } from '@/components/auth/auth-card.tsx'
import { ROUTES } from '@/constants/routes.ts'
import { useAppDispatch, useAppSelector } from '@/store/hooks.ts'
import { loginUser } from '@/store/user-slice.ts'
import type { LoginPayload } from '@/types/entities.ts'
import { Button } from '@/ui/button/button.tsx'
import { Input } from '@/ui/input/input.tsx'
import { loginSchema } from '@/utils/validation.ts'

export function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { authStatus, isAuthorized, isSessionResolved, profile } = useAppSelector((state) => state.user)
  const [formError, setFormError] = useState<string | null>(null)
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<LoginPayload>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  if (!isSessionResolved) {
    return null
  }

  if (isAuthorized) {
    return (
      <Navigate
        replace
        to={profile?.role === 'admin' ? ROUTES.adminProducts : ROUTES.dashboard}
      />
    )
  }

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)

    const validationResult = loginSchema.safeParse(values)

    if (!validationResult.success) {
      setFormError(validationResult.error.issues[0]?.message ?? 'Проверьте введенные данные.')
      return
    }

    const resultAction = await dispatch(loginUser(values))

    if (loginUser.fulfilled.match(resultAction)) {
      const from = location.state as { from?: string } | null
      const nextPath =
        resultAction.payload.role === 'admin'
          ? ROUTES.adminProducts
          : from?.from ?? ROUTES.dashboard

      navigate(nextPath, { replace: true })
    }
  })

  return (
    <AuthCard
      footerLinkLabel="Зарегистрироваться"
      footerLinkTo={ROUTES.register}
      footerText="Нет аккаунта?"
      subtitle="Войдите, чтобы собирать букеты, сохранять корзину и оформлять заказы."
      title="Вход"
    >
      <form className="auth-form" onSubmit={onSubmit}>
        <Input
          autoComplete="email"
          errorMessage={errors.email?.message}
          label="Email"
          placeholder="user@gmail.com"
          type="email"
          {...register('email', { required: 'Введите email.' })}
        />
        <Input
          autoComplete="current-password"
          errorMessage={errors.password?.message}
          label="Пароль"
          placeholder="Введите пароль"
          type="password"
          {...register('password', { required: 'Введите пароль.' })}
        />
        {formError ? <p className="auth-form__error">{formError}</p> : null}
        <div className="auth-form__actions">
          <Button disabled={authStatus === 'loading'} type="submit">
            {authStatus === 'loading' ? 'Входим...' : 'Войти'}
          </Button>
        </div>
        <div className="auth-demo">
          <p className="auth-demo__title">Быстрый вход</p>
          <p className="auth-demo__text">Аккаунт клиента: `user@gmail.com / user123`</p>
          <p className="auth-demo__text">Аккаунт администратора: `admin@gmail.com / admin123`</p>
        </div>
      </form>
    </AuthCard>
  )
}
