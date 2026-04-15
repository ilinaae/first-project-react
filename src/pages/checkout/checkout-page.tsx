import { useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Navigate, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes.ts'
import { createOrder } from '@/store/orders-slice.ts'
import { useAppDispatch, useAppSelector } from '@/store/hooks.ts'
import type { CheckoutPayload, DeliveryMethod } from '@/types/entities.ts'
import { Button } from '@/ui/button/button.tsx'
import { Input } from '@/ui/input/input.tsx'
import { SurfaceCard } from '@/ui/surface/surface-card.tsx'
import { formatPrice } from '@/utils/format-price.ts'

type CheckoutFormValues = {
  address: string
  comment: string
  deliveryMethod: DeliveryMethod
}

export function CheckoutPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { items, total } = useAppSelector((state) => state.cart)
  const { profile } = useAppSelector((state) => state.user)
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = useForm<CheckoutFormValues>({
    defaultValues: {
      address: '',
      comment: '',
      deliveryMethod: 'pickup',
    },
  })

  const deliveryMethod = useWatch({
    control,
    name: 'deliveryMethod',
  })

  const orderPreview = useMemo(
    () => items.map((item) => `${item.title} x${item.quantity}`),
    [items],
  )

  if (!profile) {
    return <Navigate replace to={ROUTES.login} />
  }

  if (items.length === 0) {
    return <Navigate replace to={ROUTES.cart} />
  }

  const onSubmit = handleSubmit(async (values) => {
    const payload: CheckoutPayload = {
      address: values.deliveryMethod === 'delivery' ? values.address : undefined,
      comment: values.comment.trim() || undefined,
      deliveryMethod: values.deliveryMethod,
      items,
      totalPrice: total,
      userId: profile.id,
    }

    const resultAction = await dispatch(createOrder(payload))

    if (createOrder.fulfilled.match(resultAction)) {
      navigate(ROUTES.profile, { replace: true })
    }
  })

  return (
    <section className="page-section">
      <div className="container checkout-layout">
        <div className="checkout-main">
          <p className="page-eyebrow">Оформление</p>
          <h1 className="page-title">Завершить заказ</h1>
          <p className="page-description">
            Укажи способ получения и, при необходимости, адрес доставки. Оплата не
            требуется, заказ просто будет отправлен в систему.
          </p>

          <SurfaceCard className="checkout-card">
            <form className="checkout-form" onSubmit={onSubmit}>
              <input type="hidden" {...register('deliveryMethod')} />

              <div className="checkout-methods">
                <button
                  className={
                    deliveryMethod === 'pickup'
                      ? 'checkout-method is-selected'
                      : 'checkout-method'
                  }
                  onClick={() => setValue('deliveryMethod', 'pickup')}
                  type="button"
                >
                  <span className="checkout-method__title">Самовывоз</span>
                  <span className="checkout-method__text">
                    Заберешь заказ в удобное время без ввода адреса.
                  </span>
                </button>

                <button
                  className={
                    deliveryMethod === 'delivery'
                      ? 'checkout-method is-selected'
                      : 'checkout-method'
                  }
                  onClick={() => setValue('deliveryMethod', 'delivery')}
                  type="button"
                >
                  <span className="checkout-method__title">Доставка</span>
                  <span className="checkout-method__text">
                    Укажи адрес, и заказ будет оформлен с доставкой.
                  </span>
                </button>
              </div>

              {deliveryMethod === 'delivery' ? (
                <Input
                  errorMessage={errors.address?.message}
                  label="Адрес доставки"
                  placeholder="Город, улица, дом, квартира"
                  type="text"
                  {...register('address', {
                    required: 'Укажите адрес доставки.',
                  })}
                />
              ) : null}

              <Input
                errorMessage={errors.comment?.message}
                label="Комментарий к заказу"
                placeholder="Например, позвонить за 15 минут"
                type="text"
                {...register('comment')}
              />

              <div className="checkout-actions">
                <Button type="submit">Оформить заказ</Button>
              </div>
            </form>
          </SurfaceCard>
        </div>

        <SurfaceCard className="checkout-summary">
          <p className="page-card__eyebrow">Состав заказа</p>
          <h2 className="page-card__title">Подтверждение</h2>
          <ul className="builder-summary__list">
            {orderPreview.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="checkout-summary__customer">Получатель: {profile.name}</p>
          <p className="builder-summary__total">Итого: {formatPrice(total)}</p>
        </SurfaceCard>
      </div>
    </section>
  )
}
