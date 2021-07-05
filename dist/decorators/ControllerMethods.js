"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE = exports.PUT = exports.POST = exports.GET = void 0;
require("reflect-metadata");
function GET(route) {
    return function (target, key, _) {
        const routeDetails = Object.assign(Object.assign({}, Reflect.getMetadata("route", target, key)), { endPoint: route, method: "get" });
        console.log(routeDetails);
        Reflect.defineMetadata("route", routeDetails, target, key);
    };
}
exports.GET = GET;
function POST(route) {
    return function (target, key, _) {
        const routeDetails = Object.assign(Object.assign({}, Reflect.getMetadata("route", target, key)), { endPoint: route, method: "post" });
        Reflect.defineMetadata("route", routeDetails, target, key);
    };
}
exports.POST = POST;
function PUT(route) {
    return function (target, key, _) {
        const routeDetails = Object.assign(Object.assign({}, Reflect.getMetadata("route", target, key)), { endPoint: route, method: "put" });
        Reflect.defineMetadata("route", routeDetails, target, key);
    };
}
exports.PUT = PUT;
function DELETE(route) {
    return function (target, key, _) {
        const routeDetails = Object.assign(Object.assign({}, Reflect.getMetadata("route", target, key)), { endPoint: route, method: "delete" });
        Reflect.defineMetadata("route", routeDetails, target, key);
    };
}
exports.DELETE = DELETE;
//# sourceMappingURL=ControllerMethods.js.map