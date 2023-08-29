"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TurnUsecase = void 0;
class TurnUsecase {
    constructor(postgresRepo) {
        this.postgresRepo = postgresRepo;
    }
    submitDrawingPart(drawingPart) {
        this.postgresRepo.upsertDrawingPart(drawingPart);
    }
}
exports.TurnUsecase = TurnUsecase;
//# sourceMappingURL=TurnUsecase.js.map