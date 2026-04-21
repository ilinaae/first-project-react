export function Loader() {
  return (
    <div className="loader-overlay" aria-live="polite" aria-label="Приложение загружается">
      <div className="loader-panel">
        <div className="loader" />
        <p className="loader-panel__text">Подготавливаем витрину магазина...</p>
      </div>
    </div>
  )
}

