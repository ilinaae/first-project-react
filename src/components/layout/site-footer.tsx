import { Link } from 'react-router-dom'
import { ROUTES } from '@/app/router/routes.ts'

const footerLinks = [
  { label: 'Букеты', to: ROUTES.catalogBouquets },
  { label: 'Цветы', to: ROUTES.catalogFlowers },
  { label: 'Подарки', to: ROUTES.catalogGifts },
  { label: 'Конструктор', to: ROUTES.builder },
]

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__lead">
          <p className="site-footer__eyebrow">Flora Boutique</p>
          <h2 className="site-footer__title">
            Онлайн-бутик цветов и подарков
          </h2>
          <p className="site-footer__text">
            Здесь можно выбрать готовые композиции, собрать собственный букет,
            добавить подарки и оформить заказ.
          </p>
        </div>

        <div className="site-footer__nav">
          {footerLinks.map((link) => (
            <Link key={link.to} className="site-footer__link" to={link.to}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}

