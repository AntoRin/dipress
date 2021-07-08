import "reflect-metadata";
import { Router } from "express";

export function UseMiddlewares(middlewares: Array<any>) {
   return function (constructor: Function) {
      const target = constructor.prototype;

      const prevRouter: Router = Reflect.getMetadata(
         "controllerRouter",
         target
      );

      if (prevRouter) {
         const router: Router = Router();
         router.use(middlewares);
         router.use(prevRouter);
         Reflect.defineMetadata("controllerRouter", router, target);
      } else {
         Reflect.defineMetadata(
            "controllerBaseMiddlewares",
            middlewares,
            target
         );
      }
   };
}
