import "reflect-metadata";
import express, { Application, Router } from "express";
import { PromiseHandler } from "../utils/PromiseHandler";
import { pathMap } from "../utils/printRoutes";
import { isFunction } from "../utils/functionCheck";

export function ApplicationServer(
   appHandler?: Application | null,
   port: number | null = 5000,
   verbose: boolean = false
) {
   return function (constructor: Function) {
      const target = constructor.prototype;
      const app = appHandler ? appHandler : express();

      const promiseHandler: PromiseHandler = new PromiseHandler();

      promiseHandler.once("success", () => {
         verbose && pathMap.displayPathMap(app);
         app.listen(port, () => console.log("Server listening on port 5000"));
      });

      promiseHandler.once("failure", error => {
         console.log("Server failed to start with the error", error);
         process.exit(1);
      });

      for (const genericMethodName of Object.getOwnPropertyNames(target)) {
         if (
            Reflect.getMetadata("startupComponent", target, genericMethodName)
         ) {
            const componentResult = target[genericMethodName]();

            if (componentResult instanceof Promise)
               promiseHandler.addNewPromise(componentResult);
         }
      }

      const controllers: Array<any> = target?.controllers();

      const catchAll = target.catchAll
         ? Reflect.getMetadata("isFactory", target, "catchAll")
            ? target.catchAll()
            : target.catchAll
         : null;

      if (controllers) {
         for (const controller of controllers) {
            const router: Router = Reflect.getMetadata(
               "controllerRouter",
               controller.prototype
            );
            if (!router) continue;

            app.use(
               Reflect.getMetadata("controllerBasePath", controller.prototype),
               router
            );
         }
      }

      catchAll && isFunction(catchAll) && app.use(catchAll);

      promiseHandler.promises.length > 0
         ? promiseHandler.executePromises()
         : promiseHandler.emit("success");
   };
}
