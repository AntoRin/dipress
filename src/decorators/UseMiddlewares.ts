import "reflect-metadata";
import { RequestHandler, Router } from "express";
import { isFunction } from "../utils/functionCheck";

export function UseMiddlewares(
   middlewares: RequestHandler | Array<RequestHandler>
) {
   return function (constructor: Function) {
      if (!isFunction(middlewares))
         throw new Error("Only functions are to be passed in for handlers");

      const target: any = constructor.prototype;

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
            ([] as Array<RequestHandler>).concat(middlewares),
            target
         );
      }
   };
}
