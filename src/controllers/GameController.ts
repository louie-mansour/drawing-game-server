import { Request, Response } from 'express'
import { Game } from '../models/Game'
import { GameUsecase } from '../usecase/GameUsecase'
import { PlayerDto } from './PlayerController'

interface GameDto {
  uuid: string
  invite: string
  owner_uuid: string
  state: string
  players: PlayerDto[]
}

interface GameResponse {
  game: GameDto
}

export class GameController {
  constructor(private readonly gameUsecase: GameUsecase) {}

  public async create(req: Request, res: Response): Promise<Response> {
    const game = await this.gameUsecase.create(req.player!)
    return res.status(200).send(this.toResponse(game))
  }

  public async join(req: Request, res: Response): Promise<Response> {
    const invite = req.body.game.invite
    const game = await this.gameUsecase.join(req.player!, invite)
    return res.status(200).send(this.toResponse(game))
  }

  public async get(req: Request, res: Response): Promise<Response> {
    const game = await this.gameUsecase.get(req.params.inviteId)
    return res.status(200).send(this.toResponse(game))
  }

  public async playerReady(req: Request, res: Response): Promise<Response> {
    const invite = req.body.game.invite
    const game = await this.gameUsecase.playerReady(req.player!, invite)
    return res.status(200).send(this.toResponse(game))
  }

  public async start(req: Request, res: Response): Promise<Response> {
    const invite = req.body.game.invite
    const game = await this.gameUsecase.start(req.player!, invite)
    return res.status(200).send(this.toResponse(game))
  }

  private toResponse(game: Game): GameResponse {
    const playerDtos: PlayerDto[] = game.players.map((p) => {
      return {
        uuid: p.uuid,
        username: p.username,
        is_ready: p.isReady,
      }
    })

    return {
      game: {
        uuid: game.uuid,
        invite: game.invite,
        owner_uuid: game.ownerUuid,
        state: game.state,
        players: playerDtos,
      },
    }
  }
}
