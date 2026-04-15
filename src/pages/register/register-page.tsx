import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate, useNavigate } from 'react-router-dom'
import { AuthCard } from '@/components/auth/auth-card.tsx'
import { ROUTES } from '@/constants/routes.ts'
import { useAppDispatch, useAppSelector } from '@/store/hooks.ts'
import { registerUser } from '@/store/user-slice.ts'
import type { RegisterPayload } from '@/types/entities.ts'
import { Button } from '@/ui/button/button.tsx'
import { Input } from '@/ui/input/input.tsx'
import { registerSchema } from '@/utils/validation.ts'

export function RegisterPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { authStatus, isAuthorized, isSessionResolved } = useAppSelector((state) => state.user)
  const [formError, setFormError] = useState<string | null>(null)
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<RegisterPayload>({
    defaultValues: {
      email: '',
      name: '',
      password: '',
      phone: '',
    },
  })

  if (!isSessionResolved) {
    return null
  }

  if (isAuthorized) {
    return <Navigate replace to={ROUTES.dashboard} />
  }

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)

    const validationResult = registerSchema.safeParse(values)

    if (!validationResult.success) {
      setFormError(validationResult.error.issues[0]?.message ?? 'Проверьте введенные данные.')
      return
    }

    const resultAction = await dispatch(registerUser(values))

    if (registerUser.fulfilled.match(resultAction)) {
      navigate(ROUTES.dashboard, { replace: true })
    }
  })

  return (
    <AuthCard
      footerLinkLabel="Войти"
      footerLinkTo={ROUTES.login}
      footerText="Уже есть аккаунт?"
      subtitle="Создайте аккаунт, чтобы оформлять заказы, собирать букеты и отслеживать историю покупок."
      title="Регистрация"
    >
      <form className="auth-form" onSubmit={onSubmit}>
        <Input
          errorMessage={errors.name?.message}
          label="Имя"
          placeholder="Например, Алина"
          type="text"
          {...register('name', { required: 'Введите имя.' })}
        />
        <Input
          autoComplete="email"
          errorMessage={errors.email?.message}
          label="Email"
          placeholder="example@mail.ru"
          type="email"
          {...register('email', { required: 'Введите email.' })}
        />
        <Input
          autoComplete="tel"
          errorMessage={errors.phone?.message}
          label="Телефон"
          placeholder="+7 (900) 123-45-67"
          type="tel"
          {...register('phone', { required: 'Введите телефон.' })}
        />
        <Input
          autoComplete="new-password"
          errorMessage={errors.password?.message}
          label="Пароль"
          placeholder="Не менее 6 символов"
          type="password"
          {...register('password', { required: 'Введите пароль.' })}
        />
        {formError ? <p className="auth-form__error">{formError}</p> : null}
        <div className="auth-form__actions">
          <Button disabled={authStatus === 'loading'} type="submit">
            {authStatus === 'loading' ? 'Создаем аккаунт...' : 'Создать аккаунт'}
          </Button>
        </div>
      </form>
    </AuthCard>
  )
}
