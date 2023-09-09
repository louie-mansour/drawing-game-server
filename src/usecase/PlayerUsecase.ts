import { Authentication } from '../middleware/Authentication'
import { Player } from '../models/Player'

export class PlayerUsecase {
  public guestLogin(player: Player): Player {
    const accessToken = player.accessToken
    if (!accessToken) {
      const guestAcccessToken = Authentication.createGuestAccessToken(player)
      return player.assignAccessToken(guestAcccessToken)
    }

    try {
      return Authentication.authenticate(accessToken)
    } catch (e: unknown) {
      const guestAcccessToken = Authentication.createGuestAccessToken(player)
      return player.assignAccessToken(guestAcccessToken)
    }
  }
}
