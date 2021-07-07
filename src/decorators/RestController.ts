import "reflect-metadata";
import { Handler, Router } from "express";
import { RouteData } from "../types";

export function RestController(routePrefix: string) {
   return function (constructor: Function) {
      const target = constructor.prototype;
      const router: Router = Router();

      const controllerBaseMiddlewares = Reflect.getMetadata(
         "controllerBaseMiddlewares",
         target
      );

      if (controllerBaseMiddlewares)
         router.use(routePrefix, controllerBaseMiddlewares);

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

            let endPointHandler: any = Reflect.getMetadata(
               "isFactory",
               target,
               propName
            )
               ? target[propName]()
               : target[propName];

            endPointHandler = Array.isArray(endPointHandler)
               ? endPointHandler
               : [endPointHandler];

            const handler: Handler =
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
      Reflect.defineMetadata("controllerBasePath", routePrefix, target);
   };
}
