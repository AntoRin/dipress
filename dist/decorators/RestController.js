"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestController = void 0;
require("reflect-metadata");
const express_1 = require("express");
function RestController(routePrefix) {
    return function (constructor) {
        const target = constructor.prototype;
        const router = express_1.Router();
        const middlewareRouter = Reflect.getMetadata("middlewareRouter", target);
        if (middlewareRouter)
            router.use(middlewareRouter);
        for (const propName of Object.getOwnPropertyNames(target)) {
            if (typeof target[propName] === "function" &&
                propName !== "constructor" &&
                propName !== "controllers") {
                const metaData = Reflect.getMetadata("route", target, propName);
                if (!metaData)
                    continue;
                const handler = metaData.preHandlers && metaData.postHandlers
                    ? [
                        ...metaData.preHandlers,
                        target[propName],
                        ...metaData.postHandlers,
                    ]
                    : metaData.preHandlers
                        ? [...metaData.preHandlers, target[propName]]
                        : metaData.postHandlers
                            ? [target[propName], ...metaData.postHandlers]
                            : target[propName];
                switch (metaData.method) {
                    case "get":
                        router.get(`${routePrefix}${metaData.endPoint}`, handler);
                        break;
                    case "post":
                        router.post(`${routePrefix}${metaData.endPoint}`, handler);
                        break;
                    case "put":
                        router.put(`${routePrefix}${metaData.endPoint}`, handler);
                        break;
                    case "delete":
                        router.delete(`${routePrefix}${metaData.endPoint}`, handler);
                        break;
                }
            }
        }
        Reflect.defineMetadata("controllerRouter", router, target);
    };
}
exports.RestController = RestController;
//# sourceMappingURL=RestController.js.map