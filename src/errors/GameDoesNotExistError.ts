export function isGameDoesNotExistError(error: unknown): error is GameDoesNotExistError {
  if (!error) {
    return false
  }
  return (error as GameDoesNotExistError).type === 'GameDoesNotExistError'
}

export class GameDoesNotExistError extends Error {
  public readonly type = 'GameDoesNotExistError'
  constructor(message: string) {
    super(message)
  }
}
