import { v4 as uuidv4 } from 'uuid'

interface ConstructorArgs {
  base64Image: string
  contributorUuid: string
  gameUuid: string
  drawingOwnerUuid?: string
  uuid?: string
}

export class DrawingPart {
  readonly base64Image: string
  readonly contributorUuid: string
  readonly gameUuid: string
  readonly drawingOwnerUuid?: string
  readonly uuid: string

  setOwner(drawingOwnerUuid: string): DrawingPart {
    return new DrawingPart({
      base64Image: this.base64Image,
      contributorUuid: this.contributorUuid,
      gameUuid: this.gameUuid,
      drawingOwnerUuid: drawingOwnerUuid,
      uuid: this.uuid,
    })
  }

  constructor(args: ConstructorArgs) {
    this.base64Image = args.base64Image
    this.contributorUuid = args.contributorUuid
    this.gameUuid = args.gameUuid
    this.drawingOwnerUuid = args.drawingOwnerUuid
    this.uuid = args.uuid ?? uuidv4()
  }
}
