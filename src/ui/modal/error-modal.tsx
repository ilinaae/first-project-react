import { Button } from '@/ui/button/button.tsx'

type ErrorModalProps = {
  message: string
  onClose: () => void
}

export function ErrorModal({ message, onClose }: ErrorModalProps) {
  return (
    <div className="error-modal" role="alert">
      <div className="error-modal__header">
        <h2 className="error-modal__title">Ошибка запроса</h2>
        <Button aria-label="Закрыть сообщение об ошибке" onClick={onClose} variant="ghost">
          Закрыть
        </Button>
      </div>
      <p className="error-modal__text">{message}</p>
    </div>
  )
}

