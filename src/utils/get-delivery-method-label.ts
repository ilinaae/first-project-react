import type { DeliveryMethod } from '@/types/entities.ts'

const deliveryLabelMap: Record<DeliveryMethod, string> = {
  delivery: 'Доставка',
  pickup: 'Самовывоз',
}

export function getDeliveryMethodLabel(method: DeliveryMethod) {
  return deliveryLabelMap[method]
}


