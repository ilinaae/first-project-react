import { Link } from 'react-router-dom'
import { ROUTES } from '@/app/router/routes.ts'
import {
  clearCart,
  removeCartItem,
  updateCartItemQuantity,
} from '@/app/store/cart-slice.ts'
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks.ts'
import { Button } from '@/ui/button/button.tsx'
import { SurfaceCard } from '@/ui/surface/surface-card.tsx'
import { formatPrice } from '@/utils/format-price.ts'

export function CartPage() {
  const dispatch = useAppDispatch()
  const { items, total } = useAppSelector((state) => state.cart)

  return (
    <section className="page-section">
      <div className="container cart-layout">
        <div className="cart-main">
          <p className="page-eyebrow">Корзина</p>
          <h1 className="page-title">Товары в корзине</h1>
          <p className="page-description">
            Проверь состав заказа, скорректируй количество позиций и переходи к оформлению.
          </p>

          {items.length === 0 ? (
            <SurfaceCard className="cart-empty">
              <h2 className="page-card__title">Корзина пока пуста</h2>
              <p className="page-description">
                Добавь готовый букет, отдельные цветы или собери авторскую композицию.
              </p>
              <Link className="page-link" to={ROUTES.catalogBouquets}>
                Перейти в каталог
              </Link>
            </SurfaceCard>
          ) : (
            <div className="cart-items">
              {items.map((item) => (
                <SurfaceCard key={item.id} className="cart-item">
                  <img alt={item.title} className="cart-item__image" src={item.image} />
                  <div className="cart-item__body">
                    <div>
                      <h2 className="cart-item__title">{item.title}</h2>
                      <p className="cart-item__price">{formatPrice(item.price)}</p>
                      {item.details?.length ? (
                        <ul className="cart-item__details">
                          {item.details.map((detail) => (
                            <li key={detail}>{detail}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                    <div className="cart-item__controls">
                      <div className="builder-quantity">
                        <Button
                          onClick={() =>
                            dispatch(
                              updateCartItemQuantity({
                                id: item.id,
                                quantity: item.quantity - 1,
                              }),
                            )
                          }
                          variant="ghost"
                        >
                          -
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          onClick={() =>
                            dispatch(
                              updateCartItemQuantity({
                                id: item.id,
                                quantity: item.quantity + 1,
                              }),
                            )
                          }
                          variant="ghost"
                        >
                          +
                        </Button>
                      </div>
                      <Button onClick={() => dispatch(removeCartItem(item.id))} variant="ghost">
                        Удалить
                      </Button>
                    </div>
                  </div>
                </SurfaceCard>
              ))}
            </div>
          )}
        </div>

        <SurfaceCard className="cart-summary">
          <p className="page-card__eyebrow">Итоги</p>
          <h2 className="page-card__title">Сводка заказа</h2>
          <p className="cart-summary__line">
            <span>Позиций</span>
            <strong>{items.length}</strong>
          </p>
          <p className="cart-summary__line">
            <span>Общая сумма</span>
            <strong>{formatPrice(total)}</strong>
          </p>
          <div className="cart-summary__actions">
            <Link
              className={items.length === 0 ? 'page-link is-disabled' : 'page-link'}
              to={items.length === 0 ? ROUTES.cart : ROUTES.checkout}
            >
              Перейти к оформлению
            </Link>
            <Button disabled={items.length === 0} onClick={() => dispatch(clearCart())} variant="ghost">
              Очистить корзину
            </Button>
          </div>
        </SurfaceCard>
      </div>
    </section>
  )
}


