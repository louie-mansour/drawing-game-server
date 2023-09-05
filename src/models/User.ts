import { v4 as uuidv4 } from 'uuid'

export class GuestUser {
  readonly username: string
  readonly uuid: string
  readonly accessToken?: string

  constructor(args: ConstructorArgs) {
    this.username = args.username
    this.uuid = args.uuid ?? uuidv4()
    this.accessToken = args.accessToken
  }

  assignAccessToken(accessToken: string): GuestUser {
    return new GuestUser({
      accessToken: accessToken,
      username: this.username,
      uuid: this.uuid,
    })
  }

  assignUuid(uuid: string): GuestUser {
    return new GuestUser({
      uuid: uuid,
      username: this.username,
      accessToken: this.accessToken,
    })
  }
}

interface ConstructorArgs {
  username: string
  uuid?: string
  accessToken?: string
}
