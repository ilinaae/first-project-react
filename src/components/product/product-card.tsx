import type { Product } from '@/types/entities.ts'
import { Button } from '@/ui/button/button.tsx'
import { SurfaceCard } from '@/ui/surface/surface-card.tsx'
import { formatPrice } from '@/utils/format-price.ts'
import { getProductImageSrc } from '@/utils/get-product-image-src.ts'

type ProductCardProps = {
  onAddToCart: (product: Product) => void
  product: Product
}

const categoryLabelMap: Record<Product['category'], string> = {
  bouquet: 'Букет',
  flower: 'Цветок',
  gift: 'Подарок',
}

export function ProductCard({ onAddToCart, product }: ProductCardProps) {
  return (
    <SurfaceCard className="product-card">
      <div className="product-card__media">
        <img
          alt={product.title}
          className="product-card__image"
          loading="lazy"
          src={getProductImageSrc(product)}
        />
        <span className="product-card__badge">{product.tags[0] ?? 'подборка'}</span>
      </div>
      <div className="product-card__body">
        <div className="product-card__header">
          <h3 className="product-card__title">{product.title}</h3>
          <p className="product-card__price">{formatPrice(product.price)}</p>
        </div>
        <p className="product-card__description">{product.description}</p>
        <div className="product-card__meta">
          <span>{product.stock > 0 ? `В наличии: ${product.stock}` : 'Нет в наличии'}</span>
          <span>{categoryLabelMap[product.category]}</span>
        </div>
        <Button
          className="product-card__button"
          disabled={!product.isAvailable || product.stock < 1}
          onClick={() => onAddToCart(product)}
        >
          {product.isAvailable && product.stock > 0 ? 'В корзину' : 'Недоступно'}
        </Button>
      </div>
    </SurfaceCard>
  )
}

