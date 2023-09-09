import jwt, { JwtPayload } from 'jsonwebtoken'
import { Player } from '../models/Player'

export class Authentication {
  public static createGuestAccessToken(player: Player): string {
    return jwt.sign(
      {
        username: player.username,
      },
      'secret',
      {
        algorithm: 'HS256',
        issuer: 'drawing-game',
        audience: 'drawing-game',
        subject: player.uuid,
      }
    )
  }

  public static authenticate(bearerToken: string): Player {
    const playerJwt = jwt.verify(bearerToken, 'secret', {
      algorithms: ['HS256'],
      complete: true,
      ignoreExpiration: true,
      issuer: 'drawing-game',
      audience: 'drawing-game',
    })

    const jwtPayload = playerJwt.payload as JwtPayload

    return new Player({
      username: jwtPayload.username,
      uuid: jwtPayload.sub,
      accessToken: bearerToken,
    })
  }
}
