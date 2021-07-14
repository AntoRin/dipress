import "reflect-metadata";
import express, { Application, RequestHandler, Router } from "express";
import { PromiseHandler } from "../utils/PromiseHandler";
import { pathMap } from "../utils/printRoutes";
import { isFunctionTypeOnly } from "../utils/functionCheck";
import { ServerConfig } from "core/interfaces/ServerConfig";
import { ApplicationOptions } from "core/interfaces/ApplicationOptions";
import { container } from "../DI/Container";
import { createMappedRouter } from "../utils/mapRoutes";
import { ControllerMetadata } from "core/interfaces/ControllerMetadata";

export function ApplicationServer({ appHandler, port = 5000, verbose = false, controllers = [] }: ApplicationOptions) {
   return function (constructor: Function) {
      const app: Application = appHandler || express();

      let appConfig: ServerConfig = {};

      if (!isFunctionTypeOnly(controllers)) throw new Error("Invalid controllers");

      appConfig.controllers = controllers;

      const promiseHandler: PromiseHandler = new PromiseHandler();

      const applicationInstance = container.resolveInstance(constructor);

      for (const propName of Object.getOwnPropertyNames(Object.getPrototypeOf(applicationInstance))) {
         if (typeof applicationInstance[propName] !== "function") continue;

         if (Reflect.getMetadata("startup-component", applicationInstance, propName)) {
            const componentResult: any = applicationInstance[propName](app);

            if (componentResult instanceof Promise) promiseHandler.addNewPromise(componentResult);
         } else if (Reflect.getMetadata("error-handler", applicationInstance, propName) && !appConfig.errorHandler) {
            const errorHandler: any[] = ([] as any[]).concat(
               Reflect.getMetadata("isFactory", applicationInstance, propName)
                  ? applicationInstance[propName]()
                  : applicationInstance[propName]
            );

            if (!isFunctionTypeOnly(errorHandler)) throw new Error("Invalid type: expected function");

            appConfig = {
               ...appConfig,
               errorHandler: errorHandler[0],
            };
         } else if (Reflect.getMetadata("application-catch-all", applicationInstance, propName) && !appConfig.catchAll) {
            const catchAll: any = ([] as any[]).concat(
               Reflect.getMetadata("isFactory", applicationInstance, propName)
                  ? applicationInstance[propName]()
                  : applicationInstance[propName]
            );

            if (!isFunctionTypeOnly(catchAll)) throw new Error("Invalid type: expected functions");

            appConfig = {
               ...appConfig,
               catchAll: catchAll[0],
            };
         } else if (
            Reflect.getMetadata("after-startup-component", applicationInstance, propName) &&
            !appConfig.afterStartupComponent
         ) {
            appConfig = {
               ...appConfig,
               afterStartupComponent: applicationInstance[propName],
            };
         }
      }

      promiseHandler.once("success", () => {
         const appControllers: Function[] | undefined = appConfig.controllers;

         if (!appControllers) throw new Error("No controllers to initialize");

         for (const controller of appControllers) {
            const controllerInstance = container.resolveInstance(controller);

            const router: Router = createMappedRouter(controllerInstance);

            const metadata: ControllerMetadata = Reflect.getMetadata("controller:metadata", Object.getPrototypeOf(controllerInstance));

            app.use(metadata.basePath, router);
         }

         const catchAll: RequestHandler | Array<RequestHandler> | undefined = appConfig.catchAll;

         catchAll && app.use("*", catchAll);

         const errorHandler: RequestHandler | Array<RequestHandler> | undefined = appConfig.errorHandler;

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

      promiseHandler.promises.length > 0 ? promiseHandler.executePromises() : promiseHandler.emit("success");
   };
}
