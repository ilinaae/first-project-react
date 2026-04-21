import { useCallback, useEffect, useMemo, useState } from 'react'
import { getAllOrdersRequest, patchOrderStatusRequest } from '@/services/api/admin-api.ts'
import { useAppDispatch } from '@/hooks/storeHooks.ts'
import { setGlobalError, setGlobalLoading } from '@/app/store/settings-slice.ts'
import type { Order, OrderStatus } from '@/types/entities.ts'
import { Button } from '@/ui/button/button.tsx'
import { SurfaceCard } from '@/ui/surface/surface-card.tsx'
import { formatPrice } from '@/utils/format-price.ts'
import { getDeliveryMethodLabel } from '@/utils/get-delivery-method-label.ts'
import { getOrderStatusLabel } from '@/utils/get-order-status-label.ts'

const statusOptions: OrderStatus[] = [
  'new',
  'confirmed',
  'assembling',
  'delivering',
  'completed',
  'cancelled',
]

export function AdminOrdersPage() {
  const dispatch = useAppDispatch()
  const [orders, setOrders] = useState<Order[]>([])
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')

  const loadOrders = useCallback(async () => {
    dispatch(setGlobalLoading(true))

    try {
      const data = await getAllOrdersRequest()
      setOrders(data)
    } catch {
      dispatch(setGlobalError('Не удалось загрузить заказы для админ-панели.'))
    } finally {
      dispatch(setGlobalLoading(false))
    }
  }, [dispatch])

  useEffect(() => {
    void loadOrders()
  }, [loadOrders])

  const handleStatusChange = async (orderId: number, status: OrderStatus) => {
    dispatch(setGlobalLoading(true))

    try {
      await patchOrderStatusRequest(orderId, status)
      await loadOrders()
    } catch {
      dispatch(setGlobalError('Не удалось обновить статус заказа.'))
    } finally {
      dispatch(setGlobalLoading(false))
    }
  }

  const visibleOrders = useMemo(
    () =>
      statusFilter === 'all'
        ? orders
        : orders.filter((order) => order.status === statusFilter),
    [orders, statusFilter],
  )

  return (
    <section className="page-section">
      <div className="container">
        <p className="page-eyebrow">Админ-панель</p>
        <h1 className="page-title">Управление заказами</h1>
        <p className="page-description">
          Здесь можно отслеживать поступившие заказы и менять их статус по мере
          обработки.
        </p>

        <div className="admin-filter-bar">
          <label className="ui-field">
            <span className="ui-field__label">Фильтр по статусу</span>
            <select
              className="ui-input"
              onChange={(event) =>
                setStatusFilter(event.target.value as OrderStatus | 'all')
              }
              value={statusFilter}
            >
              <option value="all">Все</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {getOrderStatusLabel(status)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="admin-orders-list">
          {visibleOrders.map((order) => (
            <SurfaceCard key={order.id} className="admin-order-card">
              <div className="admin-order-card__header">
                <div>
                  <h2 className="page-card__title">Заказ #{order.id}</h2>
                  <p className="admin-order-card__meta">
                    {getDeliveryMethodLabel(order.deliveryMethod)} · {formatPrice(order.totalPrice)}
                  </p>
                </div>
                <span className="profile-order-card__status">
                  {getOrderStatusLabel(order.status)}
                </span>
              </div>

              <ul className="builder-summary__list">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.title} x{item.quantity}
                  </li>
                ))}
              </ul>

              <div className="admin-order-card__actions">
                {statusOptions.map((status) => (
                  <Button
                    key={status}
                    onClick={() => handleStatusChange(order.id, status)}
                    variant={status === order.status ? 'primary' : 'ghost'}
                  >
                    {getOrderStatusLabel(status)}
                  </Button>
                ))}
              </div>
            </SurfaceCard>
          ))}
        </div>
      </div>
    </section>
  )
}

