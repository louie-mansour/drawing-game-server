import jwt, { Jwt } from 'jsonwebtoken'
import { GuestUser } from '../models/User'

export class Authentication {
  public static createGuestAccessToken(guestUser: GuestUser): string {
    return jwt.sign(
      {
        userUuid: guestUser.uuid,
        username: guestUser.username,
      },
      'secret',
      {
        algorithm: 'HS256',
        issuer: 'drawing-game',
        audience: 'drawing-game',
        subject: guestUser.uuid,
      }
    )
  }

  public static authenticate(bearerToken: string): Jwt {
    return jwt.verify(bearerToken, 'secret', {
      algorithms: ['HS256'],
      complete: true,
      ignoreExpiration: true,
      issuer: 'drawing-game',
      audience: 'drawing-game',
    })
  }
}
