import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProductsRequest } from '@/services/api/products-api.ts'
import { ROUTES } from '@/app/router/routes.ts'
import type { Product } from '@/types/entities.ts'
import { Button } from '@/ui/button/button.tsx'
import { SurfaceCard } from '@/ui/surface/surface-card.tsx'
import { formatPrice } from '@/utils/format-price.ts'
import { getProductImageSrc } from '@/utils/get-product-image-src.ts'

const advantages = [
  {
    description: 'Собирай композицию из отдельных цветов, упаковки и доп. услуг.',
    title: 'Конструктор букета',
  },
  {
    description: 'Добавляй игрушки, открытки и вазы, чтобы заказ выглядел завершенным.',
    title: 'Подарки и дополнения',
  },
  {
    description: 'От оформления до истории покупок весь путь пользователя уже работает.',
    title: 'Полный сценарий заказа',
  },
]

export function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      const products = await getProductsRequest()
      setFeaturedProducts(products.slice(0, 3))
    }

    void loadFeaturedProducts()
  }, [])

  return (
    <section className="page-section">
      <div className="container home-layout">
        <div className="home-hero">
          <div className="home-hero__content">
            <p className="page-eyebrow">Flora Boutique</p>
            <h1 className="page-title">Цветочный бутик с авторским конструктором букета</h1>
            <p className="page-description">
              Выбирай готовые композиции, цветы поштучно, подарки и оформляй заказ в
              одном аккуратном интерфейсе.
            </p>
            <div className="page-actions">
              <Link className="page-link" to={ROUTES.catalogBouquets}>
                Смотреть каталог
              </Link>
              <Link className="page-link page-link--ghost" to={ROUTES.builder}>
                Собрать свой букет
              </Link>
            </div>
          </div>

          <SurfaceCard className="home-hero__aside">
            <p className="page-card__eyebrow">В центре внимания</p>
            <h2 className="page-card__title">Коллекция этого сезона</h2>
            <p className="home-hero__aside-text">
              Мягкие оттенки, живые фактуры и упаковка, которую можно подобрать под
              настроение заказа.
            </p>
            <div className="home-hero__chips">
              <span>Букеты</span>
              <span>Цветы</span>
              <span>Подарки</span>
            </div>
          </SurfaceCard>
        </div>

        <div className="home-advantages">
          {advantages.map((item) => (
            <SurfaceCard key={item.title} className="home-advantage-card">
              <p className="page-card__eyebrow">Преимущество</p>
              <h2 className="page-card__title">{item.title}</h2>
              <p className="home-advantage-card__text">{item.description}</p>
            </SurfaceCard>
          ))}
        </div>

        <div className="home-featured">
          <div className="home-section-head">
            <div>
              <p className="page-eyebrow">Популярное</p>
              <h2 className="page-card__title">Избранные позиции каталога</h2>
            </div>
            <Link className="page-link page-link--ghost" to={ROUTES.catalogBouquets}>
              Все товары
            </Link>
          </div>

          <div className="home-featured__grid">
            {featuredProducts.map((product) => (
              <SurfaceCard key={product.id} className="home-featured-card">
                <img
                  alt={product.title}
                  className="home-featured-card__image"
                  src={getProductImageSrc(product)}
                />
                <div className="home-featured-card__body">
                  <div>
                    <h3 className="home-featured-card__title">{product.title}</h3>
                    <p className="home-featured-card__price">{formatPrice(product.price)}</p>
                  </div>
                  <p className="home-featured-card__description">{product.description}</p>
                  <Button>В каталог</Button>
                </div>
              </SurfaceCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

