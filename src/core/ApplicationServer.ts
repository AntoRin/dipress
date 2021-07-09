import "reflect-metadata";
import express, { Application, RequestHandler, Router } from "express";
import { PromiseHandler } from "../utils/PromiseHandler";
import { pathMap } from "../utils/printRoutes";
import { isFunction } from "../utils/functionCheck";
import { ServerConfig } from "../types";

export function ApplicationServer(
   appHandler?: Application | null,
   port: number = 5000,
   verbose: boolean = false
) {
   return function (constructor: Function) {
      const target: any = constructor.prototype;
      const app: Application = appHandler ? appHandler : express();

      let appConfig: ServerConfig = {};

      const promiseHandler: PromiseHandler = new PromiseHandler();

      for (const propName of Object.getOwnPropertyNames(target)) {
         if (typeof target[propName] !== "function") continue;

         if (Reflect.getMetadata("startup-component", target, propName)) {
            const componentResult: any = target[propName](app);

            if (componentResult instanceof Promise)
               promiseHandler.addNewPromise(componentResult);
         } else if (
            Reflect.getMetadata("controller-imports", target, propName) &&
            !appConfig.controllers
         ) {
            const controllers: any = target[propName]();

            if (!isFunction(controllers))
               throw new Error("Invalid controller imports");

            appConfig = {
               ...appConfig,
               controllers: ([] as Array<Function>).concat(controllers),
            };
         } else if (
            Reflect.getMetadata("error-handler", target, propName) &&
            !appConfig.errorHandler
         ) {
            const errorHandler: Array<any> = ([] as Array<any>).concat(
               Reflect.getMetadata("isFactory", target, propName)
                  ? target[propName]()
                  : target[propName]
            );

            if (!isFunction(errorHandler))
               throw new Error("Invalid type: expected function");

            appConfig = {
               ...appConfig,
               errorHandler: errorHandler[0],
            };
         } else if (
            Reflect.getMetadata("application-catch-all", target, propName) &&
            !appConfig.catchAll
         ) {
            const catchAll: any = Reflect.getMetadata(
               "isFactory",
               target,
               propName
            )
               ? target[propName]()
               : target[propName];

            if (!isFunction(catchAll))
               throw new Error("Invalid type: expected functions");

            appConfig = {
               ...appConfig,
               catchAll,
            };
         } else if (
            Reflect.getMetadata("after-startup-component", target, propName) &&
            !appConfig.afterStartupComponent
         ) {
            appConfig = {
               ...appConfig,
               afterStartupComponent: target[propName],
            };
         }
      }

      promiseHandler.once("success", () => {
         const appControllers: Array<Function> | undefined =
            appConfig.controllers;

         if (!appControllers) throw new Error("No controllers to initialize");

         for (const controller of appControllers) {
            const router: Router = Reflect.getMetadata(
               "controller-router",
               controller.prototype
            );
            if (!router) continue;

            app.use(
               Reflect.getMetadata(
                  "controller-base-path",
                  controller.prototype
               ),
               router
            );
         }

         const catchAll: RequestHandler | Array<RequestHandler> | undefined =
            appConfig.catchAll;

         catchAll && app.use(catchAll);

         const errorHandler:
            | RequestHandler
            | Array<RequestHandler>
            | undefined = appConfig.errorHandler;

         errorHandler && app.use(errorHandler);

         verbose && pathMap.displayPathMap(app);

         const server = app.listen(port, async () => {
            console.log(`Server listening on port ${port}`);
            if (appConfig.afterStartupComponent) {
               const afterEffects = appConfig.afterStartupComponent(server);
               if (afterEffects instanceof Promise) await afterEffects;
            }
         });
      });

      promiseHandler.once("failure", error => {
         console.log("Server failed to start with the error", error);
         process.exit(1);
      });

      promiseHandler.promises.length > 0
         ? promiseHandler.executePromises()
         : promiseHandler.emit("success");
   };
}
