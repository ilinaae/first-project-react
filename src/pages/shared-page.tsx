import { Link } from 'react-router-dom'
import { SurfaceCard } from '@/ui/surface/surface-card.tsx'
import { Button } from '@/ui/button/button.tsx'
import { ROUTES } from '@/app/router/routes.ts'

type SharedPageProps = {
  description: string
  eyebrow: string
  highlights?: string[]
  title: string
}

const defaultHighlights = [
  'Визуальная база готова для дальнейшего наполнения разделов магазина.',
  'Маршрут уже подключен к общему layout и wrappers.',
  'На следующих этапах эта страница получит реальный контент и логику.',
]

export function SharedPage({
  description,
  eyebrow,
  highlights = defaultHighlights,
  title,
}: SharedPageProps) {
  return (
    <section className="page-section">
      <div className="container">
        <div className="page-hero">
          <div className="page-hero__content">
            <p className="page-eyebrow">{eyebrow}</p>
            <h1 className="page-title">{title}</h1>
            <p className="page-description">{description}</p>

            <div className="page-actions">
              <Link className="page-link" to={ROUTES.catalogBouquets}>
                Перейти в каталог
              </Link>
              <Link className="page-link page-link--ghost" to={ROUTES.builder}>
                Открыть конструктор
              </Link>
            </div>
          </div>

          <SurfaceCard className="page-hero__card">
            <p className="page-card__eyebrow">Текущий блок</p>
            <h2 className="page-card__title">Общая система интерфейса</h2>
            <ul className="page-checklist">
              {highlights.map((highlight) => (
                <li key={highlight} className="page-checklist__item">
                  {highlight}
                </li>
              ))}
            </ul>
            <Button variant="secondary">Дизайн-система готова</Button>
          </SurfaceCard>
        </div>
      </div>
    </section>
  )
}

