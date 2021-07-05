import "reflect-metadata";
import express from "express";

export function Application(constructor: Function) {
   const target = constructor.prototype;
   const app = express();

   for (const genericMethodName of Object.getOwnPropertyNames(target)) {
      if (Reflect.getMetadata("startupComponent", target, genericMethodName))
         target[genericMethodName]();
   }

   const controllers = target.controllers();

   if (!controllers) return;

   for (const controller of controllers) {
      const router = Reflect.getMetadata(
         "controllerRouter",
         controller.prototype
      );

      if (!router) continue;

      app.use(router);
   }

   app.listen(5000, () => console.log("Server listening on port 5000"));
}
