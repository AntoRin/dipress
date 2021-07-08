import "reflect-metadata";
import { RequestHandler, Router } from "express";
import { RouteData } from "../types";

export function RestController(routePrefix: string = "") {
   return function (constructor: Function) {
      const target: any = constructor.prototype;
      const router: Router = Router();

      const controllerBaseMiddlewares: Array<RequestHandler> =
         Reflect.getMetadata("controllerBaseMiddlewares", target);

      if (controllerBaseMiddlewares) router.use(controllerBaseMiddlewares);

      for (const propName of Object.getOwnPropertyNames(target)) {
         if (
            typeof target[propName] === "function" &&
            propName !== "constructor" &&
            propName !== "controllers"
         ) {
            const metaData: RouteData = Reflect.getMetadata(
               "route",
               target,
               propName
            );

            if (!metaData) continue;

            const endPointHandler: Array<RequestHandler> = (
               [] as Array<RequestHandler>
            ).concat(
               Reflect.getMetadata("isFactory", target, propName)
                  ? target[propName]()
                  : target[propName]
            );

            const handler: RequestHandler | Array<RequestHandler> =
               metaData.preRouteHandlers && metaData.postRouteHandlers
                  ? [
                       ...metaData.preRouteHandlers,
                       ...endPointHandler,
                       ...metaData.postRouteHandlers,
                    ]
                  : metaData.preRouteHandlers
                  ? [...metaData.preRouteHandlers, ...endPointHandler]
                  : metaData.postRouteHandlers
                  ? [...endPointHandler, ...metaData.postRouteHandlers]
                  : endPointHandler;

            switch (metaData.method) {
               case "get":
                  router.get(metaData.endPoint, handler);
                  break;
               case "post":
                  router.post(metaData.endPoint, handler);
                  break;
               case "put":
                  router.put(metaData.endPoint, handler);
                  break;
               case "delete":
                  router.delete(metaData.endPoint, handler);
                  break;
            }
         }
      }

      Reflect.defineMetadata("controllerRouter", router, target);
      Reflect.defineMetadata("controllerBasePath", routePrefix, target);
   };
}
