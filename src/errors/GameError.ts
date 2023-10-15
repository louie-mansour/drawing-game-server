export function isGameError(error: unknown): error is GameError {
  if (!error) {
    return false
  }
  return (error as GameError).type === 'GameError'
}

export class GameError extends Error {
  public readonly type = 'GameError'
  constructor(message: string) {
    super(message)
  }
}
