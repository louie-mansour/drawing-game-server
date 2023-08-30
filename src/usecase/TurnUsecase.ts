import { DrawingPart } from '../models/FinishedDrawingPart'
import { PostgresRepo } from '../repos/PostgresRepo'

export class TurnUsecase {
  constructor(private readonly postgresRepo: PostgresRepo) {}
  public async submitDrawingPart(drawingPart: DrawingPart) {
    await this.postgresRepo.upsertDrawingPart(drawingPart)
  }
}