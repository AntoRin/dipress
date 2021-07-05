"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TestDecorators_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestDecorators = void 0;
const Application_1 = require("./decorators/Application");
const ControllerMethods_1 = require("./decorators/ControllerMethods");
const PostHandler_1 = require("./decorators/PostHandler");
const PreHandlers_1 = require("./decorators/PreHandlers");
const RestController_1 = require("./decorators/RestController");
const StartupComponent_1 = require("./decorators/StartupComponent");
const UseMiddlewares_1 = require("./decorators/UseMiddlewares");
function middleware(_, __, next) {
    console.log("middleware hit");
    return next();
}
function preHandler(_, __, next) {
    console.log("preHandler hit!!!");
    return next();
}
function postHandler(_, __, next) {
    console.log("postHandler hit!!!");
    return next();
}
let TestDecorators = TestDecorators_1 = class TestDecorators {
    controllers() {
        return [TestDecorators_1];
    }
    method1(_, res) {
        res.send("home page");
    }
    method2(_, res, next) {
        res.send("about page");
        return next();
    }
    method3() {
        console.log("DB connection, perhaps...");
    }
};
__decorate([
    PreHandlers_1.PreHandlers([preHandler]),
    ControllerMethods_1.GET("/home"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TestDecorators.prototype, "method1", null);
__decorate([
    ControllerMethods_1.GET("/about"),
    PreHandlers_1.PreHandlers([preHandler]),
    PostHandler_1.PostHandlers([postHandler]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", void 0)
], TestDecorators.prototype, "method2", null);
__decorate([
    StartupComponent_1.startupComponent,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestDecorators.prototype, "method3", null);
TestDecorators = TestDecorators_1 = __decorate([
    Application_1.Application,
    UseMiddlewares_1.UseMiddlewares([middleware]),
    RestController_1.RestController("/api")
], TestDecorators);
exports.TestDecorators = TestDecorators;
//# sourceMappingURL=sample.js.map