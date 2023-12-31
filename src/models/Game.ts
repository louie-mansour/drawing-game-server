import { v4 as uuidv4 } from 'uuid'
import { DrawingPart } from './DrawingPart'
import { Player } from './Player'

interface ConstructorArgs {
  ownerUuid: string
  players: Player[]
  drawingParts: DrawingPart[]
  uuid?: string
  state?: GameState
}

export enum GameState {
  Lobby = 'Lobby',
  DrawingInProgress = 'DrawingInProgress',
}

export class Game {
  readonly ownerUuid: string
  readonly invite: string
  readonly players: Player[]
  readonly drawingParts: DrawingPart[][]
  readonly uuid: string
  readonly state: GameState

  constructor(args: ConstructorArgs) {
    const uuid = args.uuid ?? uuidv4()
    this.ownerUuid = args.ownerUuid
    this.uuid = uuid
    this.invite = uuid
    this.players = args.players
    this.state = args.state ?? GameState.Lobby
    this.drawingParts = args.players.map((p) => {
      return args.drawingParts.filter((dp) => dp.drawingOwnerUuid === p.uuid)
    })
  }

  startGame(): Game {
    return new Game({
      ownerUuid: this.ownerUuid,
      players: this.players,
      drawingParts: this.drawingParts.flatMap((d) => d),
      uuid: this.uuid,
      state: this.state,
    })
  }

  updatePlayer(player: Player) {
    const players = this.players
    const playerIdx = players.findIndex((p: Player) => p.uuid === player.uuid)
    players[playerIdx] = player

    return new Game({
      ownerUuid: this.ownerUuid,
      players: players,
      drawingParts: this.drawingParts.flatMap((d) => d),
      uuid: this.uuid,
      state: this.state,
    })
  }

  setTurnOrder(): Game {
    this.players.sort((_a, _b) => 0.5 - Math.random()) // eslint-disable-line @typescript-eslint/no-unused-vars
    return this
  }

  getDrawingOwnerOfContribution(player: Player): string {
    const previousDrawingPart = this.getPreviousPartOfDrawing(player)

    if (!previousDrawingPart) {
      return player.uuid
    }

    if (!previousDrawingPart.drawingOwnerUuid) {
      throw new Error('No owner listed for previous drawing part')
    }

    return previousDrawingPart.drawingOwnerUuid
  }

  getPreviousPartOfDrawing(player: Player): DrawingPart | null {
    const numberOfCompletedTurns = this.drawingParts
      .flatMap((dp) => dp)
      .filter((dp) => dp.contributorUuid === player.uuid).length

    const playerIndex = this.players.map((p) => p.uuid).indexOf(player.uuid)
    const drawingOwnerIndex = (playerIndex + numberOfCompletedTurns) % this.players.length
    const drawingPartIndex = numberOfCompletedTurns

    if (drawingOwnerIndex > this.drawingParts.length) {
      throw new Error('Drawing owner index out of bounds')
    }

    if (drawingPartIndex > this.drawingParts[drawingOwnerIndex].length + 1) {
      throw new Error('Drawing part index out of bounds')
    }

    if (drawingPartIndex === 0) {
      return null
    }

    const previousDrawingPart = this.drawingParts[drawingOwnerIndex][drawingPartIndex - 1]

    if (!previousDrawingPart) {
      throw new Error('No previous drawing part was found')
    }

    return previousDrawingPart
  }
}
