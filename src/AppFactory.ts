import { TurnController } from './controllers/TurnController'
import { PostgresRepo } from './repos/PostgresRepo'
import { TurnUsecase } from './usecase/TurnUsecase'

export class AppFactory {
  public static async buildApp() {
    // Repos
    const postgresqlRepo = new PostgresRepo({
      host: 'db',
      user: 'postgres',
      password: 'example',
      database: 'drawing_game',
      port: 5432,
    })
    await postgresqlRepo.migratePostgres('migrations')

    // Use Cases
    const turnUsecase = new TurnUsecase(postgresqlRepo)

    // Controllers
    const turnController = new TurnController(turnUsecase)

    return {
      turnController,
    }
  }
}
