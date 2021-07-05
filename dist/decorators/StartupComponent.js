"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startupComponent = void 0;
require("reflect-metadata");
function startupComponent(target, key, _) {
    Reflect.defineMetadata("startupComponent", true, target, key);
}
exports.startupComponent = startupComponent;
//# sourceMappingURL=StartupComponent.js.map