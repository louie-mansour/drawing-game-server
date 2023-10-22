import { Pool, QueryResultRow } from 'pg'
import { migrate } from 'postgres-migrations'
import { GameDoesNotExistError } from '../errors/GameDoesNotExistError'
import { DrawingPart } from '../models/DrawingPart'
import { Game, GameState } from '../models/Game'
import { Player } from '../models/Player'

interface PostgresConfig {
  user: string
  host: string
  database: string
  password: string
  port: number
}

export class PostgresRepo {
  private readonly pool: Pool
  constructor(config: PostgresConfig) {
    this.pool = new Pool(config)
  }

  public async upsertGame(game: Game): Promise<Game> {
    const currentDatetime = new Date()
    const res = await this.pool.query(
      `
      INSERT INTO games (uuid, owner_uuid, invite, players, state, created_datetime, modified_datetime)
      VALUES ($1, $2, $3, $4, $5, $6, $6)
      ON CONFLICT (uuid)
      DO UPDATE SET players = EXCLUDED.players
      RETURNING *;
    `,
      [game.uuid, game.ownerUuid, game.invite, JSON.stringify(game.players), game.state, currentDatetime]
    )
    const record = res.rows[0]
    return this.toGame(record)
  }

  public async addPlayerToGame(player: Player, invite: string): Promise<Game> {
    const currentDatetime = new Date()
    const res = await this.pool.query(
      `
      UPDATE games SET players = players || $1::jsonb, modified_datetime = $2
      WHERE invite = $3
      RETURNING *;
    `,
      [JSON.stringify(player), currentDatetime, invite]
    )
    if (res.rows.length === 0) {
      throw new GameDoesNotExistError(`Invite ${invite} does not match any known game`)
    }
    const record = res.rows[0]
    return this.toGame(record)
  }

  public async startGame(invite: string): Promise<Game> {
    const currentDatetime = new Date()
    const res = await this.pool.query(
      `
      UPDATE games SET state = $1, modified_datetime = $2
      WHERE invite = $3 AND state = $4
      RETURNING *;
    `,
      [GameState.DrawingInProgress, currentDatetime, invite, GameState.Lobby]
    )
    if (res.rows.length === 0) {
      throw new GameDoesNotExistError(`Invite ${invite} does not match any known game in status ${GameState.Lobby}`)
    }
    const record = res.rows[0]
    return this.toGame(record)
  }

  public async getGame(inviteId: string): Promise<Game> {
    const gameRes = await this.pool.query(
      `
      SELECT * FROM games
      WHERE invite = $1;
    `,
      [inviteId]
    )
    const gameRecord = gameRes.rows[0]

    if (!gameRecord) {
      throw new GameDoesNotExistError(`Game with invite ${inviteId} does not exist`)
    }
    const drawingPartsRes = await this.pool.query(
      `
      SELECT * FROM drawing_parts
      WHERE game_uuid = $1
    `,
      [gameRecord.uuid]
    )
    const drawingPartRecords = drawingPartsRes.rows
    return this.toGame(gameRecord, drawingPartRecords)
  }

  public async getGameByUuid(gameUuid: string): Promise<Game> {
    const gameRes = await this.pool.query(
      `
      SELECT * FROM games
      WHERE uuid = $1;
    `,
      [gameUuid]
    )
    const gameRecord = gameRes.rows[0]

    const drawingPartsRes = await this.pool.query(
      `
      SELECT * FROM drawing_parts
      WHERE game_uuid = $1
    `,
      [gameRecord.uuid]
    )
    const drawingPartRecords = drawingPartsRes.rows
    return this.toGame(gameRecord, drawingPartRecords)
  }

  public async insertDrawingPart(drawingPart: DrawingPart): Promise<DrawingPart> {
    const currentDatetime = new Date()
    const res = await this.pool.query(
      `
      INSERT INTO drawing_parts (uuid, base_64_image, owner_uuid, contributor_uuid, game_uuid, created_datetime, modified_datetime)
      VALUES ($1, $2, $3, $4, $5, $6, $6)
      RETURNING *;
    `,
      [
        drawingPart.uuid,
        drawingPart.base64Image,
        drawingPart.drawingOwnerUuid,
        drawingPart.contributorUuid,
        drawingPart.gameUuid,
        currentDatetime,
      ]
    )
    const record = res.rows[0]
    return this.toDrawingPart(record)
  }

  public async migratePostgres(migrationDirectory: string) {
    try {
      await migrate({ client: this.pool }, migrationDirectory)
    } catch (e) {
      console.log(e)
    }
  }

  private toDrawingPart(record: QueryResultRow): DrawingPart {
    return new DrawingPart({
      base64Image: record.base_64_image,
      contributorUuid: record.contributor_uuid,
      gameUuid: record.game_uuid,
      drawingOwnerUuid: record.owner_uuid,
      uuid: record.uuid,
    })
  }

  private toGame(gameRecord: QueryResultRow, drawingPartRecords?: QueryResultRow[]): Game {
    const drawingParts = drawingPartRecords
      ? drawingPartRecords.map((dpr: QueryResultRow) => {
          return this.toDrawingPart(dpr)
        })
      : []

    return new Game({
      ownerUuid: gameRecord.owner_uuid,
      players: gameRecord.players
        .map((p: object) => {
          return this.toPlayer(p)
        })
        .filter((p: Player) => p.isActive()),
      state: gameRecord.state,
      drawingParts: drawingParts,
      uuid: gameRecord.uuid,
    })
  }

  private toPlayer(input: QueryResultRow): Player {
    return new Player({
      uuid: input.uuid,
      username: input.username,
      isReady: input.isReady,
    })
  }
}
