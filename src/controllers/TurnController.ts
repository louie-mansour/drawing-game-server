import { Request, Response } from 'express'
import { DrawingPart } from '../models/DrawingPart'
import { TurnUsecase } from '../usecase/TurnUsecase'

export class TurnController {
  constructor(private readonly turnUsecase: TurnUsecase) {}

  public async submitDrawingPart(req: Request, res: Response): Promise<Response> {
    const submittedDrawingPart = new DrawingPart({
      base64Image: req.body.drawing.base64Image,
      ownerId: 'test',
    })
    const savedDrawingPart = await this.turnUsecase.submitDrawingPart(submittedDrawingPart)
    return res.status(200).send({
      drawing: {
        base_64_image: savedDrawingPart.base64Image,
        owner_id: savedDrawingPart.ownerId,
        uuid: savedDrawingPart.uuid,
      },
    })
  }

  public async getPreviousDrawingPart(req: Request, res: Response): Promise<Response> {
    const drawingPart = await this.turnUsecase.getPreviousDrawingPart()
    return res.status(200).send({
      drawing: {
        base_64_image: drawingPart.base64Image,
        owner_id: drawingPart.ownerId,
        uuid: drawingPart.uuid,
      },
    })
  }
}
