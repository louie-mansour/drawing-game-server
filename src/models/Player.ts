import { v4 as uuidv4 } from 'uuid'

interface ConstructorArgs {
  username: string
  uuid?: string
  accessToken?: string
}

export class Player {
  readonly username: string
  readonly uuid: string
  readonly accessToken?: string

  constructor(args: ConstructorArgs) {
    this.username = args.username
    this.uuid = args.uuid ?? uuidv4()
    this.accessToken = args.accessToken
  }

  assignAccessToken(accessToken: string): Player {
    return new Player({
      accessToken: accessToken,
      username: this.username,
      uuid: this.uuid,
    })
  }
}
