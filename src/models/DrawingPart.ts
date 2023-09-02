import { v4 as uuidv4 } from 'uuid'

export class DrawingPart {
  readonly base64Image: string
  readonly ownerId: string
  readonly uuid: string

  constructor(args: ConstructorArgs) {
    this.base64Image = args.base64Image
    this.ownerId = args.ownerId
    this.uuid = args.uuid ?? uuidv4()
  }
}

interface ConstructorArgs {
  base64Image: string
  ownerId: string
  uuid?: string
}
