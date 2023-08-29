"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TurnController = void 0;
const FinishedDrawingPart_1 = require("../models/FinishedDrawingPart");
class TurnController {
    constructor(turnUsecase) {
        this.turnUsecase = turnUsecase;
    }
    submitDrawingPart(req, res) {
        const drawingPart = new FinishedDrawingPart_1.DrawingPart({
            base64Image: req.body.base64Image,
            ownerId: 'test',
        });
        this.turnUsecase.submitDrawingPart(drawingPart);
        return res;
    }
}
exports.TurnController = TurnController;
//# sourceMappingURL=TurnController.js.map