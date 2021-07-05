"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostHandlers = void 0;
require("reflect-metadata");
function PostHandlers(handlers) {
    return function (target, key, _) {
        const postHandlerMetaData = Object.assign(Object.assign({}, Reflect.getMetadata("route", target, key)), { postHandlers: handlers });
        console.log(postHandlerMetaData);
        Reflect.defineMetadata("route", postHandlerMetaData, target, key);
    };
}
exports.PostHandlers = PostHandlers;
//# sourceMappingURL=PostHandler.js.map