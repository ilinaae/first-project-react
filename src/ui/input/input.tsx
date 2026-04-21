import type { InputHTMLAttributes } from 'react'
import clsx from 'clsx'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  errorMessage?: string
  label: string
}

export function Input({
  className,
  errorMessage,
  id,
  label,
  ...props
}: InputProps) {
  const fallbackId = label.toLowerCase().replace(/\s+/g, '-')
  const inputId = id ?? fallbackId

  return (
    <label className="ui-field" htmlFor={inputId}>
      <span className="ui-field__label">{label}</span>
      <input
        className={clsx('ui-input', errorMessage ? 'ui-input--error' : null, className)}
        id={inputId}
        {...props}
      />
      {errorMessage ? <span className="ui-field__error">{errorMessage}</span> : null}
    </label>
  )
}

