import { TurnController } from './controllers/TurnController'
import { UserController } from './controllers/UserController'
import { PostgresRepo } from './repos/PostgresRepo'
import { TurnUsecase } from './usecase/TurnUsecase'
import { UserUsecase } from './usecase/UserUsecase'

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
    const userUsecas = new UserUsecase()

    // Controllers
    const turnController = new TurnController(turnUsecase)
    const userController = new UserController(userUsecas)

    return {
      turnController,
      userController,
    }
  }
}
