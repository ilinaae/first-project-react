import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CatalogFilters } from '@/components/product/catalog-filters.tsx'
import { ProductCard } from '@/components/product/product-card.tsx'
import { ProductEmptyState } from '@/components/product/product-empty-state.tsx'
import { ROUTES } from '@/constants/routes.ts'
import {
  fetchProducts,
  resetCatalogFilters,
  setSearchTerm,
  setShowOnlyAvailable,
} from '@/store/products-slice.ts'
import { addCartItem } from '@/store/cart-slice.ts'
import { useAppDispatch, useAppSelector } from '@/store/hooks.ts'
import { setGlobalError } from '@/store/settings-slice.ts'
import type { Product, ProductCategory } from '@/types/entities.ts'

type CatalogPageProps = {
  category: ProductCategory
}

const categoryMap: Record<ProductCategory, string> = {
  bouquet: 'Каталог готовых букетов с карточками товаров, фильтрами и сортировкой.',
  flower: 'Каталог цветов поштучно с выбором количества для составления собственного букета.',
  gift: 'Каталог подарков с игрушками и дополнительными товарами к заказу.',
}

const categoryTitleMap: Record<ProductCategory, string> = {
  bouquet: 'Каталог: букеты',
  flower: 'Каталог: цветы',
  gift: 'Каталог: подарки',
}

export function CatalogPage({ category }: CatalogPageProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isAuthorized } = useAppSelector((state) => state.user)
  const { items, searchTerm, showOnlyAvailable, status } = useAppSelector(
    (state) => state.products,
  )

  useEffect(() => {
    void dispatch(fetchProducts(category))
    dispatch(resetCatalogFilters())
  }, [category, dispatch])

  const visibleItems = items.filter((item) => {
    const matchesAvailability = showOnlyAvailable ? item.isAvailable && item.stock > 0 : true
    const normalizedSearch = searchTerm.trim().toLowerCase()
    const matchesSearch =
      normalizedSearch.length === 0
        ? true
        : `${item.title} ${item.description}`.toLowerCase().includes(normalizedSearch)

    return matchesAvailability && matchesSearch
  })

  const handleAddToCart = (product: Product) => {
    if (!isAuthorized) {
      dispatch(setGlobalError('Чтобы добавить товар в корзину, сначала войдите в аккаунт.'))
      navigate(ROUTES.login)
      return
    }

    dispatch(
      addCartItem({
        id: `${product.id}-${Date.now()}`,
        image: product.image,
        price: product.price,
        quantity: 1,
        title: product.title,
        type: 'product',
      }),
    )
  }

  return (
    <section className="page-section">
      <div className="container">
        <div className="catalog-hero">
          <p className="page-eyebrow">Каталог</p>
          <h1 className="page-title">{categoryTitleMap[category]}</h1>
          <p className="page-description">{categoryMap[category]}</p>
        </div>

        <CatalogFilters
          onAvailabilityChange={(value) => dispatch(setShowOnlyAvailable(value))}
          onReset={() => dispatch(resetCatalogFilters())}
          onSearchChange={(value) => dispatch(setSearchTerm(value))}
          searchTerm={searchTerm}
          showOnlyAvailable={showOnlyAvailable}
        />

        {status === 'loading' ? (
          <div className="catalog-status">Загружаем товары...</div>
        ) : null}

        {status !== 'loading' && visibleItems.length === 0 ? (
          <ProductEmptyState description="Попробуйте изменить поисковый запрос или сбросить фильтры." />
        ) : null}

        {visibleItems.length > 0 ? (
          <div className="product-grid">
            {visibleItems.map((product) => (
              <ProductCard key={product.id} onAddToCart={handleAddToCart} product={product} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
