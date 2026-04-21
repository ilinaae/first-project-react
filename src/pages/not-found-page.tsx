import { Link } from 'react-router-dom'
import { ROUTES } from '@/app/router/routes.ts'
import { SurfaceCard } from '@/ui/surface/surface-card.tsx'

export function NotFoundPage() {
  return (
    <section className="page-section">
      <div className="container">
        <SurfaceCard className="not-found-card">
          <p className="page-eyebrow">404</p>
          <h1 className="page-title">Страница не найдена</h1>
          <p className="page-description">
            Такой страницы нет. Используй кнопку ниже, чтобы вернуться на главную.
          </p>
          <Link className="page-link" to={ROUTES.home}>
            Вернуться на главную
          </Link>
        </SurfaceCard>
      </div>
    </section>
  )
}


