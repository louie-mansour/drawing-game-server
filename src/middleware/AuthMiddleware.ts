import { NextFunction, Request, Response } from 'express'
import { Authentication } from './Authentication'

export class AuthMiddleware {
  public static authenticate(req: Request, res: Response, next: NextFunction): void {
    const authorizationHeader = req.headers.authorization
    if (!authorizationHeader) {
      throw new Error('Unauthorized')
    }
    const bearerToken = authorizationHeader.split(' ')[1]
    Authentication.authenticate(bearerToken)
    next()
  }
}
