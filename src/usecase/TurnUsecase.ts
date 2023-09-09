import { DrawingPart } from '../models/DrawingPart'
import { Player } from '../models/Player'
import { PostgresRepo } from '../repos/PostgresRepo'

export class TurnUsecase {
  constructor(private readonly postgresRepo: PostgresRepo) {}

  public async submitDrawingPart(drawingPart: DrawingPart, player: Player): Promise<DrawingPart> {
    const game = await this.postgresRepo.getGame(drawingPart.gameUuid)
    const owner = game.getDrawingOwnerOfContribution(player)
    const drawingPartWithOwner = drawingPart.setOwner(owner)
    return await this.postgresRepo.insertDrawingPart(drawingPartWithOwner)
  }

  public async getPreviousDrawingPart(player: Player, gameUuid: string): Promise<DrawingPart | null> {
    const game = await this.postgresRepo.getGame(gameUuid)
    return game.getPreviousPartOfDrawing(player)
  }
}
