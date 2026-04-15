import { Outlet } from 'react-router-dom'
import { SiteFooter } from '@/components/layout/site-footer.tsx'
import { SiteHeader } from '@/components/layout/site-header.tsx'

export function AppLayout() {
  return (
    <div className="app-shell">
      <SiteHeader />
      <main className="site-main">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
