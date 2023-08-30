import { Request, Response } from 'express'
import { DrawingPart } from '../models/FinishedDrawingPart'
import { TurnUsecase } from '../usecase/TurnUsecase'

export class TurnController {
  constructor(private readonly turnUsecase: TurnUsecase) {}

  public async submitDrawingPart(req: Request, res: Response): Promise<Response> {
    const drawingPart = new DrawingPart({
      base64Image: req.body.drawing.base64Image,
      ownerId: 'test',
    })
    await this.turnUsecase.submitDrawingPart(drawingPart)
    return res
  }
}
