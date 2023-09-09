import { TurnController } from './controllers/TurnController'
import { PlayerController as PlayerController } from './controllers/PlayerController'
import { PostgresRepo } from './repos/PostgresRepo'
import { TurnUsecase } from './usecase/TurnUsecase'
import { PlayerUsecase as PlayerUsecase } from './usecase/PlayerUsecase'
import { GameUsecase } from './usecase/GameUsecase'
import { GameController } from './controllers/GameController'

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
    const playerUsecase = new PlayerUsecase()
    const gameUsecase = new GameUsecase(postgresqlRepo)

    // Controllers
    const turnController = new TurnController(turnUsecase)
    const playerController = new PlayerController(playerUsecase)
    const gameController = new GameController(gameUsecase)

    return {
      turnController,
      playerController,
      gameController,
    }
  }
}
