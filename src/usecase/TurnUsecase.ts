import { DrawingPart } from "../models/FinishedDrawingPart";
import { PostgresRepo } from "../repos/PostgresRepo";

export class TurnUsecase {
    constructor(
        private readonly postgresRepo: PostgresRepo,
    ) {}
    public submitDrawingPart(drawingPart: DrawingPart) {
        this.postgresRepo.upsertDrawingPart(drawingPart)
    }
}