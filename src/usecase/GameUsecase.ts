import { Game } from '../models/Game'
import { Player } from '../models/Player'
import { PostgresRepo } from '../repos/PostgresRepo'

export class GameUsecase {
  constructor(private readonly postgresRepo: PostgresRepo) {}

  public async create(owner: Player): Promise<Game> {
    const game = new Game({
      ownerUuid: owner.uuid,
      players: [owner],
      drawingParts: [],
    })
    return await this.postgresRepo.saveGame(game)
  }

  public async join(player: Player, invite: string): Promise<Game> {
    return await this.postgresRepo.addPlayerToGame(player, invite)
  }

  public async get(gameUuid: string): Promise<Game> {
    return await this.postgresRepo.getGame(gameUuid)
  }
}
