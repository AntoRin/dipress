import "reflect-metadata";
import { RequestHandler } from "express";
import { ControllerMetadata } from "../../../interfaces/ControllerMetadata";

export function RestController(routePrefix: string = "") {
   return function (constructor: Function) {
      const target: any = constructor.prototype;

      const controllerBaseMiddlewares: RequestHandler[] = Reflect.getMetadata("controller-middleware", target);

      const postControllerMiddlewares: RequestHandler[] = Reflect.getMetadata("post-controller-middleware", target);

      const controllerMetadata: ControllerMetadata = {
         basePath: routePrefix,
         entryHandlers: controllerBaseMiddlewares || [],
         exitHandlers: postControllerMiddlewares || [],
      };

      Reflect.defineMetadata("controller:metadata", controllerMetadata, target);
   };
}
