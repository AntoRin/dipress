"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
function Application(constructor) {
    const target = constructor.prototype;
    const app = express_1.default();
    for (const genericMethodName of Object.getOwnPropertyNames(target)) {
        if (Reflect.getMetadata("startupComponent", target, genericMethodName))
            target[genericMethodName]();
    }
    const controllers = target.controllers();
    if (!controllers)
        return;
    for (const controller of controllers) {
        const router = Reflect.getMetadata("controllerRouter", controller.prototype);
        if (!router)
            continue;
        app.use(router);
    }
    app.listen(5000, () => console.log("Server listening on port 5000"));
}
exports.Application = Application;
//# sourceMappingURL=Application.js.map