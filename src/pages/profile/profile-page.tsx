import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { fetchUserOrders } from '@/store/orders-slice.ts'
import { updateUserProfile } from '@/store/user-slice.ts'
import { useAppDispatch, useAppSelector } from '@/store/hooks.ts'
import { Button } from '@/ui/button/button.tsx'
import { Input } from '@/ui/input/input.tsx'
import { SurfaceCard } from '@/ui/surface/surface-card.tsx'
import { formatPrice } from '@/utils/format-price.ts'
import { getDeliveryMethodLabel } from '@/utils/get-delivery-method-label.ts'
import { getOrderStatusLabel } from '@/utils/get-order-status-label.ts'

type ProfileFormValues = {
  email: string
  name: string
  phone: string
}

export function ProfilePage() {
  const dispatch = useAppDispatch()
  const { profile } = useAppSelector((state) => state.user)
  const { userOrders } = useAppSelector((state) => state.orders)
  const [isEditing, setIsEditing] = useState(false)
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<ProfileFormValues>({
    defaultValues: {
      email: profile?.email ?? '',
      name: profile?.name ?? '',
      phone: profile?.phone ?? '',
    },
  })

  useEffect(() => {
    if (profile) {
      void dispatch(fetchUserOrders(profile.id))
      reset({
        email: profile.email,
        name: profile.name,
        phone: profile.phone,
      })
    }
  }, [dispatch, profile, reset])

  if (!profile) {
    return null
  }

  const onSubmit = handleSubmit(async (values) => {
    const resultAction = await dispatch(
      updateUserProfile({
        ...values,
        userId: profile.id,
      }),
    )

    if (updateUserProfile.fulfilled.match(resultAction)) {
      setIsEditing(false)
    }
  })

  return (
    <section className="page-section">
      <div className="container profile-layout">
        <div className="profile-main">
          <p className="page-eyebrow">Кабинет</p>
          <h1 className="page-title">Профиль</h1>
          <p className="page-description">
            Здесь собраны твои контактные данные и история заказов в Flora Boutique.
          </p>

          <SurfaceCard className="profile-card">
            <div className="profile-card__header">
              <h2 className="page-card__title">Личные данные</h2>
              <Button onClick={() => setIsEditing((current) => !current)} variant="ghost">
                {isEditing ? 'Отменить' : 'Редактировать'}
              </Button>
            </div>

            {isEditing ? (
              <form className="profile-form" onSubmit={onSubmit}>
                <Input
                  errorMessage={errors.name?.message}
                  label="Имя"
                  placeholder="Твое имя"
                  type="text"
                  {...register('name', { required: 'Введите имя.' })}
                />
                <Input
                  errorMessage={errors.email?.message}
                  label="Email"
                  placeholder="you@mail.ru"
                  type="email"
                  {...register('email', { required: 'Введите email.' })}
                />
                <Input
                  errorMessage={errors.phone?.message}
                  label="Телефон"
                  placeholder="+7 (900) 123-45-67"
                  type="tel"
                  {...register('phone', { required: 'Введите телефон.' })}
                />
                <div className="profile-form__actions">
                  <Button type="submit">Сохранить</Button>
                </div>
              </form>
            ) : (
              <div className="profile-fields">
                <p className="profile-field">
                  <span>Имя</span>
                  <strong>{profile.name}</strong>
                </p>
                <p className="profile-field">
                  <span>Email</span>
                  <strong>{profile.email}</strong>
                </p>
                <p className="profile-field">
                  <span>Телефон</span>
                  <strong>{profile.phone}</strong>
                </p>
                <p className="profile-field">
                  <span>Роль</span>
                  <strong>{profile.role === 'admin' ? 'Администратор' : 'Пользователь'}</strong>
                </p>
              </div>
            )}
          </SurfaceCard>
        </div>

        <div className="profile-orders">
          <p className="page-card__eyebrow">История заказов</p>
          {userOrders.length === 0 ? (
            <SurfaceCard className="profile-card">
              <h2 className="page-card__title">Заказов пока нет</h2>
              <p className="page-description">
                После оформления заказа он появится здесь вместе со статусом.
              </p>
            </SurfaceCard>
          ) : (
            userOrders.map((order) => (
              <SurfaceCard key={order.id} className="profile-order-card">
                <div className="profile-order-card__header">
                  <h2 className="page-card__title">Заказ #{order.id}</h2>
                  <span className="profile-order-card__status">
                    {getOrderStatusLabel(order.status)}
                  </span>
                </div>
                <p className="profile-order-card__meta">
                  Способ получения: {getDeliveryMethodLabel(order.deliveryMethod)}
                </p>
                <ul className="builder-summary__list">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.title} x{item.quantity}
                    </li>
                  ))}
                </ul>
                <p className="builder-summary__total">Сумма: {formatPrice(order.totalPrice)}</p>
              </SurfaceCard>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
