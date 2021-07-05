import { Router } from "express";

export function UseMiddlewares(middlewares: Array<any>) {
   return function (constructor: Function) {
      const target = constructor.prototype;
      const router = Router();

      const prevRouter = Reflect.getMetadata("controllerRouter", target);

      if (prevRouter) {
         router.use([...middlewares, prevRouter]);

         Reflect.defineMetadata("controllerRouter", router, target);
      } else {
         router.use(middlewares);
         Reflect.defineMetadata("middlewareRouter", router, target);
      }
   };
}
