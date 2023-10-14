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
    return await this.postgresRepo.upsertGame(game)
  }

  public async join(player: Player, invite: string): Promise<Game> {
    // TODO: concurrency issue here - something to fix
    const game = await this.postgresRepo.getGame(invite)
    if (
      game.players.find((p: Player) => {
        p.uuid === player.uuid
      })
    ) {
      return game
    }
    return await this.postgresRepo.addPlayerToGame(player, invite)
  }

  public async get(inviteId: string): Promise<Game> {
    return await this.postgresRepo.getGame(inviteId)
  }

  public async playerReady(player: Player, inviteId: string): Promise<Game> {
    const game = await this.postgresRepo.getGame(inviteId)
    return await this.postgresRepo.upsertGame(game.updatePlayer(player.setReady()))
  }
}
