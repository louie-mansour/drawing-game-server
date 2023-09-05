import { JwtPayload } from 'jsonwebtoken'
import { Authentication } from '../middleware/Authentication'
import { GuestUser } from '../models/User'

export class UserUsecase {
  public guestLogin(guestUser: GuestUser): GuestUser {
    const accessToken = guestUser.accessToken
    if (!accessToken) {
      const guestAcccessToken = Authentication.createGuestAccessToken(guestUser)
      return guestUser.assignAccessToken(guestAcccessToken)
    }

    try {
      const jwt = Authentication.authenticate(accessToken)
      return guestUser.assignUuid((jwt.payload as JwtPayload).uuid)
    } catch (e: unknown) {
      const guestAcccessToken = Authentication.createGuestAccessToken(guestUser)
      return guestUser.assignAccessToken(guestAcccessToken)
    }
  }
}
