import { Request, Response } from 'express'
import { Player } from '../models/Player'
import { PlayerUsecase } from '../usecase/PlayerUsecase'

export interface PlayerDto {
  uuid: string
  username: string
}

interface PlayerResponse {
  player: PlayerDto
  access_token: string
}

export class PlayerController {
  constructor(private readonly playerUsecase: PlayerUsecase) {}

  public guestLogin(req: Request, res: Response): Response {
    const player = this.toPlayer(req)
    const guestWithAccessToken = this.playerUsecase.guestLogin(player)
    return res.status(200).send(this.toResponse(guestWithAccessToken))
  }

  private toPlayer(req: Request): Player {
    const existingaccessToken = req.headers.authorization?.split(' ')[1]
    const username = req.body.player.username
    return new Player({
      username: username,
      accessToken: existingaccessToken,
    })
  }

  private toResponse(player: Player): PlayerResponse {
    return {
      player: {
        uuid: player.uuid,
        username: player.username,
      },
      access_token: player.accessToken!,
    }
  }
}
