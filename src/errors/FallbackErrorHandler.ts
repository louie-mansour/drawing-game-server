import { Response } from 'express'
import { isGameDoesNotExistError } from './GameDoesNotExistError'

export class FallbackErrorHandler {
  handle(res: Response, error: unknown): Response {
    // eslint-disable-line @typescript-eslint/no-unused-vars
    console.log(error)

    if (isGameDoesNotExistError(error)) {
      return res.status(400).send({ message: error.message })
    }
    return res.status(500).send(error)
  }
}
