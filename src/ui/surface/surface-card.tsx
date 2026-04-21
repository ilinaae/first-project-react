import type { PropsWithChildren } from 'react'
import clsx from 'clsx'

type SurfaceCardProps = PropsWithChildren<{
  className?: string
}>

export function SurfaceCard({ children, className }: SurfaceCardProps) {
  return <div className={clsx('surface-card', className)}>{children}</div>
}

