import type { PropsWithChildren } from 'react'
import { SiteFooter } from '@/components/layout/site-footer.tsx'
import { SiteHeader } from '@/components/layout/site-header.tsx'

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="app-shell">
      <SiteHeader />
      <main className="site-main">{children}</main>
      <SiteFooter />
    </div>
  )
}

