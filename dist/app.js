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
const AppFactory_1 = require("./AppFactory");
() => __awaiter(void 0, void 0, void 0, function* () {
    const express = require('express');
    const app = express();
    const port = 3001;
    const controllers = yield AppFactory_1.AppFactory.buildApp();
    app.get('/', (req, res) => {
        console.log('hello');
        res.send(200);
    });
    app.put('/drawing/submit', (req, res) => {
        return controllers.turnController.submitDrawingPart(req, res);
    });
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
});
//# sourceMappingURL=app.js.map