import type { PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'
import { SurfaceCard } from '@/ui/surface/surface-card.tsx'

type AuthCardProps = PropsWithChildren<{
  footerText: string
  footerLinkLabel: string
  footerLinkTo: string
  subtitle: string
  title: string
}>

export function AuthCard({
  children,
  footerLinkLabel,
  footerLinkTo,
  footerText,
  subtitle,
  title,
}: AuthCardProps) {
  return (
    <section className="page-section page-section--auth">
      <div className="container auth-layout">
        <div className="auth-layout__intro">
          <p className="page-eyebrow">Flora Boutique</p>
          <h1 className="page-title">{title}</h1>
          <p className="page-description">{subtitle}</p>
        </div>

        <SurfaceCard className="auth-card">
          {children}
          <p className="auth-card__footer">
            {footerText} <Link to={footerLinkTo}>{footerLinkLabel}</Link>
          </p>
        </SurfaceCard>
      </div>
    </section>
  )
}


