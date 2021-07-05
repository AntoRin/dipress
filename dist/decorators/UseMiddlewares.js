"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseMiddlewares = void 0;
const express_1 = require("express");
function UseMiddlewares(middlewares) {
    return function (constructor) {
        const target = constructor.prototype;
        const router = express_1.Router();
        const prevRouter = Reflect.getMetadata("controllerRouter", target);
        if (prevRouter) {
            router.use([...middlewares, prevRouter]);
            Reflect.defineMetadata("controllerRouter", router, target);
        }
        else {
            router.use(middlewares);
            Reflect.defineMetadata("middlewareRouter", router, target);
        }
    };
}
exports.UseMiddlewares = UseMiddlewares;
//# sourceMappingURL=UseMiddlewares.js.map