"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreHandlers = void 0;
require("reflect-metadata");
function PreHandlers(handlers) {
    return function (target, key, _) {
        const preHandlerMetaData = Object.assign(Object.assign({}, Reflect.getMetadata("route", target, key)), { preHandlers: handlers });
        console.log(preHandlerMetaData);
        Reflect.defineMetadata("route", preHandlerMetaData, target, key);
    };
}
exports.PreHandlers = PreHandlers;
//# sourceMappingURL=PreHandlers.js.map