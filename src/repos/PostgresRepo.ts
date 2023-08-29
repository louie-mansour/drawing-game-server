import { Pool } from "pg";
import { migrate } from "postgres-migrations";
import { DrawingPart } from "../models/FinishedDrawingPart";

export class PostgresRepo {
    private readonly pool: Pool
    constructor(config: PostgresConfig) {
        this.pool = new Pool(config)
    }

    public upsertDrawingPart(drawingPart: DrawingPart) {
        
    }

    public async migratePostgres(migrationDirectory: string) {
        try {
            await migrate({client: this.pool}, migrationDirectory)
        } catch(e) {
            console.log(e)
        }
    }
}

interface PostgresConfig {
    user: string;
    host: string;
    database: string;
    password: string;
    port: number;
}