import type { OrderStatus } from '@/types/entities.ts'

const statusLabelMap: Record<OrderStatus, string> = {
  assembling: 'Собирается',
  cancelled: 'Отменен',
  completed: 'Завершен',
  confirmed: 'Подтвержден',
  delivering: 'Доставляется',
  new: 'Новый',
}

export function getOrderStatusLabel(status: OrderStatus) {
  return statusLabelMap[status]
}

