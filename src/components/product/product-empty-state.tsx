import { SurfaceCard } from '@/ui/surface/surface-card.tsx'

type ProductEmptyStateProps = {
  description: string
}

export function ProductEmptyState({ description }: ProductEmptyStateProps) {
  return (
    <SurfaceCard className="product-empty-state">
      <h3 className="product-empty-state__title">Ничего не найдено</h3>
      <p className="product-empty-state__description">{description}</p>
    </SurfaceCard>
  )
}


