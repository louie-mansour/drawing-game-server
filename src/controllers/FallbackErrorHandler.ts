import { Response } from 'express'

export class FallbackErrorHandler {
  handle(res: Response) {
    res.send(500)
  }
}
