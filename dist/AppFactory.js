"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppFactory = void 0;
const TurnController_1 = require("./controllers/TurnController");
const PostgresRepo_1 = require("./repos/PostgresRepo");
const TurnUsecase_1 = require("./usecase/TurnUsecase");
class AppFactory {
    static buildApp() {
        return __awaiter(this, void 0, void 0, function* () {
            // Repos
            const postgresqlRepo = new PostgresRepo_1.PostgresRepo({
                host: 'db',
                user: 'postgres',
                password: 'example',
                database: 'drawing_game',
                port: 5432,
            });
            console.log('starting database migration');
            yield postgresqlRepo.migratePostgres('migrations');
            console.log('database migration completee');
            // Use Cases
            const turnUsecase = new TurnUsecase_1.TurnUsecase(postgresqlRepo);
            // Controllers
            const turnController = new TurnController_1.TurnController(turnUsecase);
            return {
                turnController,
            };
        });
    }
}
exports.AppFactory = AppFactory;
//# sourceMappingURL=AppFactory.js.map