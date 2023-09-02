import { DrawingPart } from '../models/DrawingPart'
import { PostgresRepo } from '../repos/PostgresRepo'

export class TurnUsecase {
  constructor(private readonly postgresRepo: PostgresRepo) {}

  public async submitDrawingPart(drawingPart: DrawingPart): Promise<DrawingPart> {
    return await this.postgresRepo.upsertDrawingPart(drawingPart)
  }

  public async getPreviousDrawingPart(): Promise<DrawingPart> {
    return await this.postgresRepo.getMostRecentDrawingPart()
  }
}
