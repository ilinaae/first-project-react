import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes.ts'
import { useAppSelector } from '@/store/hooks.ts'
import { SurfaceCard } from '@/ui/surface/surface-card.tsx'
import { formatPrice } from '@/utils/format-price.ts'
import { getOrderStatusLabel } from '@/utils/get-order-status-label.ts'

const quickLinks = [
  {
    description: 'Выбрать готовые композиции и новые позиции.',
    title: 'Каталог',
    to: ROUTES.catalogBouquets,
  },
  {
    description: 'Собрать букет из цветов, упаковки и услуг.',
    title: 'Конструктор',
    to: ROUTES.builder,
  },
  {
    description: 'Проверить данные аккаунта и историю покупок.',
    title: 'Профиль',
    to: ROUTES.profile,
  },
]

export function DashboardPage() {
  const { items, total } = useAppSelector((state) => state.cart)
  const { userOrders } = useAppSelector((state) => state.orders)
  const { profile } = useAppSelector((state) => state.user)
  const latestOrder = userOrders[0]

  return (
    <section className="page-section">
      <div className="container dashboard-layout">
        <div className="dashboard-main">
          <p className="page-eyebrow">Кабинет</p>
          <h1 className="page-title">Привет, {profile?.name ?? 'гость'}</h1>
          <p className="page-description">
            Здесь собраны быстрые действия, состояние корзины и информация о последнем
            заказе.
          </p>

          <div className="dashboard-cards">
            <SurfaceCard className="dashboard-card">
              <p className="page-card__eyebrow">Корзина</p>
              <h2 className="page-card__title">{items.length} поз.</h2>
              <p className="dashboard-card__text">Общая сумма: {formatPrice(total)}</p>
              <Link className="page-link page-link--ghost" to={ROUTES.cart}>
                Открыть корзину
              </Link>
            </SurfaceCard>

            <SurfaceCard className="dashboard-card">
              <p className="page-card__eyebrow">Последний заказ</p>
              <h2 className="page-card__title">
                {latestOrder ? `#${latestOrder.id}` : 'Пока нет'}
              </h2>
              <p className="dashboard-card__text">
                {latestOrder
                  ? `Статус: ${getOrderStatusLabel(latestOrder.status)}`
                  : 'После оформления он появится здесь.'}
              </p>
              <Link className="page-link page-link--ghost" to={ROUTES.profile}>
                История заказов
              </Link>
            </SurfaceCard>
          </div>
        </div>

        <div className="dashboard-quick-links">
          {quickLinks.map((item) => (
            <SurfaceCard key={item.title} className="dashboard-link-card">
              <p className="page-card__eyebrow">Быстрый переход</p>
              <h2 className="page-card__title">{item.title}</h2>
              <p className="dashboard-card__text">{item.description}</p>
              <Link className="page-link page-link--ghost" to={item.to}>
                Перейти
              </Link>
            </SurfaceCard>
          ))}
        </div>
      </div>
    </section>
  )
}
