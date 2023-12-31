import { NextFunction, Request, Response } from 'express'
import { Player } from '../models/Player'
import { Authentication } from './Authentication'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      player?: Player
    }
  }
}

export class AuthMiddleware {
  public static authenticate(req: Request, res: Response, next: NextFunction): void {
    const authorizationHeader = req.headers.authorization
    if (!authorizationHeader) {
      res.send(401)
      return
    }
    const bearerToken = authorizationHeader.split(' ')[1]
    const player = Authentication.authenticate(bearerToken)
    req.player = player
    next()
  }
}
