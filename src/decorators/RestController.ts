import "reflect-metadata";
import { Router } from "express";
import { RouteData } from "../types";

export function RestController(routePrefix: string) {
   return function (constructor: Function) {
      const target = constructor.prototype;
      const router: Router = Router();

      const middlewareRouter: Router = Reflect.getMetadata(
         "middlewareRouter",
         target
      );

      if (middlewareRouter) router.use(middlewareRouter);

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

            const handler =
               metaData.preHandlers && metaData.postHandlers
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
