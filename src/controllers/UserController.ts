import { Request, Response } from 'express'
import { GuestUser } from '../models/User'
import { UserUsecase } from '../usecase/UserUsecase'

export class UserController {
  constructor(private readonly userUsecase: UserUsecase) {}

  public guestLogin(req: Request, res: Response): Response {
    const existingaccessToken = req.headers.authorization?.split(' ')[1]
    const username = req.body.user.username
    const guestUser = new GuestUser({
      username: username,
      accessToken: existingaccessToken,
    })
    const guestWithAccessToken = this.userUsecase.guestLogin(guestUser)
    return res.status(200).send({
      access_token: guestWithAccessToken.accessToken,
      user: {
        uuid: guestWithAccessToken.uuid,
        username: guestWithAccessToken.username,
      },
    })
  }
}
