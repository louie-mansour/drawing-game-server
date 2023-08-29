import { Request, Response } from "express";
import { DrawingPart } from "../models/FinishedDrawingPart";
import { TurnUsecase } from "../usecase/TurnUsecase";

export class TurnController {
    constructor(
        private readonly turnUsecase: TurnUsecase,
    ) {}

    public submitDrawingPart(req: Request, res: Response): Response {
        const drawingPart = new DrawingPart({
            base64Image: req.body.base64Image,
            ownerId: 'test',
        })
        this.turnUsecase.submitDrawingPart(drawingPart)
        return res
    }
}
