import "reflect-metadata";
import { Router } from "express";

export function UseMiddlewares(middlewares: Array<any>) {
   return function (constructor: Function) {
      const target = constructor.prototype;
      const router: Router = Router();

      const prevRouter: Router = Reflect.getMetadata(
         "controllerRouter",
         target
      );

      console.log(prevRouter);

      if (prevRouter) {
         router.use(
            Reflect.getMetadata("controllerBasePath", target),
            middlewares
         );
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
