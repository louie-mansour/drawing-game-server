import { Request, Response } from 'express'
import { DrawingPart } from '../models/DrawingPart'
import { TurnUsecase } from '../usecase/TurnUsecase'

interface DrawingPartDto {
  base_64_image: string
  contributor_uuid: string
  uuid: string
  game_uuid: string
}

interface DrawingPartResponse {
  drawing_part: DrawingPartDto | null
}

export class TurnController {
  constructor(private readonly turnUsecase: TurnUsecase) {}

  public async submitDrawingPart(req: Request, res: Response): Promise<Response> {
    const submittedDrawingPart = this.toDrawingPart(req)
    const savedDrawingPart = await this.turnUsecase.submitDrawingPart(submittedDrawingPart, req.player!)
    return res.status(200).send(this.toResponse(savedDrawingPart))
  }

  public async getPreviousDrawingPart(req: Request, res: Response): Promise<Response> {
    const drawingPart = await this.turnUsecase.getPreviousDrawingPart(req.player!, req.params.game_uuid)
    return res.status(200).send(this.toResponse(drawingPart))
  }

  private toDrawingPart(req: Request): DrawingPart {
    return new DrawingPart({
      base64Image: req.body.drawing_part.base_64_image,
      gameUuid: req.body.drawing_part.game_uuid,
      contributorUuid: req.player!.uuid!,
    })
  }

  private toResponse(drawingPart: DrawingPart | null): DrawingPartResponse {
    if (drawingPart === null) {
      return {
        drawing_part: null,
      }
    }
    return {
      drawing_part: {
        base_64_image: drawingPart.base64Image,
        contributor_uuid: drawingPart.contributorUuid,
        uuid: drawingPart.uuid,
        game_uuid: drawingPart.gameUuid,
      },
    }
  }
}
