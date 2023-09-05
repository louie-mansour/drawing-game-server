import { Pool } from 'pg'
import { migrate } from 'postgres-migrations'
import { DrawingPart } from '../models/DrawingPart'

export class PostgresRepo {
  private readonly pool: Pool
  constructor(config: PostgresConfig) {
    this.pool = new Pool(config)
  }

  public async upsertDrawingPart(drawingPart: DrawingPart): Promise<DrawingPart> {
    const currentDatetime = new Date()
    await this.pool.query(
      `
      INSERT INTO drawings (uuid, base64image, created_datetime, modified_datetime)
      VALUES ($1, $2, $3, $3);
    `,
      [drawingPart.uuid, drawingPart.base64Image, currentDatetime]
    )
    return drawingPart
  }

  public async getMostRecentDrawingPart(): Promise<DrawingPart> {
    const res = await this.pool.query(`
      SELECT * FROM drawings
      ORDER BY created_datetime DESC
      LIMIT 1;
    `)
    const record = res.rows[0]
    return new DrawingPart({
      base64Image: record.base64image,
      ownerId: 'test',
      uuid: record.uuid,
    })
  }

  public async migratePostgres(migrationDirectory: string) {
    try {
      await migrate({ client: this.pool }, migrationDirectory)
    } catch (e) {
      console.log(e)
    }
  }
}

interface PostgresConfig {
  user: string
  host: string
  database: string
  password: string
  port: number
}
