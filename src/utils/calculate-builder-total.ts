import type { ExtraService, PackagingOption, Product } from '@/types/entities.ts'

export function calculateBuilderTotal(args: {
  extras: ExtraService[]
  packaging: PackagingOption | null
  quantities: Record<number, number>
  flowers: Product[]
}) {
  const flowersTotal = args.flowers.reduce((sum, flower) => {
    return sum + flower.price * (args.quantities[flower.id] ?? 0)
  }, 0)

  const packagingTotal = args.packaging?.price ?? 0
  const extrasTotal = args.extras.reduce((sum, extra) => sum + extra.price, 0)

  return flowersTotal + packagingTotal + extrasTotal
}


