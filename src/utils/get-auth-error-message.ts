export function getAuthErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Не удалось выполнить запрос. Попробуйте еще раз.'
}

