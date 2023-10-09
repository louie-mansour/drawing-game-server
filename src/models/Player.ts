import { v4 as uuidv4 } from 'uuid'

interface ConstructorArgs {
  username: string
  uuid?: string
  accessToken?: string
  isReady?: boolean
  lastPing?: Date
}

export class Player {
  readonly username: string
  readonly uuid: string
  readonly accessToken?: string
  readonly isReady: boolean
  readonly lastPing: Date

  constructor(args: ConstructorArgs) {
    this.username = args.username
    this.uuid = args.uuid ?? uuidv4()
    this.accessToken = args.accessToken
    this.isReady = args.isReady ?? false
    this.lastPing = args.lastPing ?? new Date(Date.now())
  }

  assignAccessToken(accessToken: string): Player {
    return new Player({
      accessToken: accessToken,
      username: this.username,
      uuid: this.uuid,
      isReady: this.isReady,
      lastPing: this.lastPing,
    })
  }

  setReady() {
    return new Player({
      isReady: true,
      accessToken: this.accessToken,
      username: this.username,
      uuid: this.uuid,
      lastPing: this.lastPing,
    })
  }

  isActive(): boolean {
    const epochNow = new Date(Date.now()).getTime()
    const lastPingEpoch = this.lastPing.getTime()
    const secondsSinceLastPing = (epochNow - lastPingEpoch) / 1000
    return secondsSinceLastPing < 30
  }
}
