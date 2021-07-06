import "reflect-metadata";
import express, { Application } from "express";
import { PromiseHandler } from "../utils/PromiseHandler";

export function Server(appHandler?: Application) {
   return function (constructor: Function) {
      const target = constructor.prototype;
      const app = appHandler ? appHandler : express();

      const promiseHandler: PromiseHandler = new PromiseHandler();

      promiseHandler.once("success", () => {
         console.log("success");
         app.listen(5000, () => console.log("Server listening on port 5000"));
      });

      promiseHandler.once("failure", error => {
         console.log("Server failed to start with the error", error);
         process.exit(1);
      });

      for (const [idx, genericMethodName] of Object.getOwnPropertyNames(
         target
      ).entries()) {
         if (
            Reflect.getMetadata("startupComponent", target, genericMethodName)
         ) {
            const componentResult = target[genericMethodName]();

            if (componentResult instanceof Promise)
               promiseHandler.addNewPromise(componentResult);
         }

         if (idx >= Object.getOwnPropertyNames(target).length - 1)
            promiseHandler.executePromises();
      }

      const controllers: Array<any> = target.controllers();

      if (!controllers) return;

      for (const controller of controllers) {
         const router = Reflect.getMetadata(
            "controllerRouter",
            controller.prototype
         );
         if (!router) continue;
         app.use(router);
      }

      promiseHandler.promises.length === 0 && promiseHandler.emit("success");
   };
}
