import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import clsx from 'clsx'

type ButtonVariant = 'ghost' | 'primary' | 'secondary'

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  variant?: ButtonVariant
}

export function Button({
  children,
  className,
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx('ui-button', `ui-button--${variant}`, className)}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}

