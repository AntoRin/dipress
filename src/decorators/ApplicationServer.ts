import "reflect-metadata";
import express, { Application, RequestHandler, Router } from "express";
import { PromiseHandler } from "../utils/PromiseHandler";
import { pathMap } from "../utils/printRoutes";
import { isFunction } from "../utils/functionCheck";

export function ApplicationServer(
   appHandler?: Application | null,
   port: number = 5000,
   verbose: boolean = false
) {
   return function (constructor: Function) {
      const target: any = constructor.prototype;
      const app: Application = appHandler ? appHandler : express();

      const promiseHandler: PromiseHandler = new PromiseHandler();

      promiseHandler.once("success", () => {
         verbose && pathMap.displayPathMap(app);
         app.listen(port, () =>
            console.log(`Server listening on port ${port}`)
         );
      });

      promiseHandler.once("failure", error => {
         console.log("Server failed to start with the error", error);
         process.exit(1);
      });

      for (const genericMethodName of Object.getOwnPropertyNames(target)) {
         if (
            Reflect.getMetadata("startupComponent", target, genericMethodName)
         ) {
            const componentResult: any = target[genericMethodName]();

            if (componentResult instanceof Promise)
               promiseHandler.addNewPromise(componentResult);
         }
      }

      const controllers: Array<Function> = target?.controllers();

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

      const catchAll: RequestHandler | Array<RequestHandler> | null =
         target.catchAll
            ? Reflect.getMetadata("isFactory", target, "catchAll")
               ? target.catchAll()
               : target.catchAll
            : null;

      catchAll && isFunction(catchAll) && app.use(catchAll);

      promiseHandler.promises.length > 0
         ? promiseHandler.executePromises()
         : promiseHandler.emit("success");
   };
}
