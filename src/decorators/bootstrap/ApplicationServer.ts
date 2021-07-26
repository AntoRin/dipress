import express, { Application, ErrorRequestHandler, RequestHandler } from "express";
import { container } from "../../DI/Container";
import { ApplicationOptions } from "../../interfaces/ApplicationOptions";
import { ControllerMetadata } from "../../interfaces/ControllerMetadata";
import { ControllerModel } from "../../interfaces/ControllerModel";
import { ServerConfig } from "../../interfaces/ServerConfig";
import { responseContext } from "../../router/ResponseContext";
import { RouterContext } from "../../router/RouterContext";
import { ObjectConstructor } from "../../types";
import { isFunctionTypeOnly } from "../../utils/functionCheck";
import { pathMap } from "../../utils/printRoutes";
import { PromiseHandler } from "../../utils/PromiseHandler";

/**
 * @param ApplicationOptions: {   appHandler?: Application; port?: number; verbose?: "no" | "minimal" | "detailed"; controllers: Function[]; }
 *
 * * Initialize application with controllers.
 * * A new instance of app is created by default, but a pre-configured instance of express application can be used.
 * * Using the verbose option logs controller and route details to the console.
 */
export function ApplicationServer({ controllers = [], port = 5000, appHandler, verbose = "no" }: ApplicationOptions) {
   return function (Constructor: ObjectConstructor<any>): void {
      const app: Application = appHandler || express();

      let appConfig: ServerConfig = {};

      if (!isFunctionTypeOnly(controllers)) throw new Error("Invalid controllers");

      appConfig.controllers = controllers;

      const promiseHandler: PromiseHandler = new PromiseHandler();
      const applicationInstance = container.resolveInstance(Constructor);

      for (const propName of Object.getOwnPropertyNames(Object.getPrototypeOf(applicationInstance))) {
         if (typeof applicationInstance[propName] !== "function") continue;

         if (Reflect.getMetadata("startup-component", applicationInstance, propName)) {
            const componentResult: any = applicationInstance[propName](app);

            if (componentResult instanceof Promise) promiseHandler.addNewPromise(componentResult);
         } else if (
            Reflect.getMetadata("error-handler", applicationInstance, propName) &&
            !appConfig.errorHandler &&
            !Reflect.getMetadata("errorHandler:active", applicationInstance)
         ) {
            const errorHandler: ErrorRequestHandler[] = ([] as ErrorRequestHandler[]).concat(
               Reflect.getMetadata("isFactory", applicationInstance, propName)
                  ? (applicationInstance[propName] as Function).apply(applicationInstance, [])
                  : responseContext.createErrorResponseHandler(propName, applicationInstance)
            );

            if (!isFunctionTypeOnly(errorHandler)) throw new Error("Invalid type: expected function");

            appConfig = {
               ...appConfig,
               errorHandler: errorHandler[0],
            };

            Reflect.defineMetadata("errorHandler:active", true, applicationInstance);
         } else if (Reflect.getMetadata("application-catch-all", applicationInstance, propName) && !appConfig.catchAll) {
            const catchAll: RequestHandler[] = ([] as RequestHandler[]).concat(
               Reflect.getMetadata("isFactory", applicationInstance, propName)
                  ? (applicationInstance[propName] as Function).apply(applicationInstance, [])
                  : responseContext.createResponseHandler(propName, applicationInstance)
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
         const appControllers: ObjectConstructor<any>[] | undefined = appConfig.controllers;

         if (!appControllers) throw new Error("No controllers to initialize");

         let printableModel: ControllerModel[] = [];

         for (const controller of appControllers) {
            const controllerInstance = container.resolveInstance(controller);
            const { router, model } = new RouterContext(controllerInstance).createMappedRouter();

            printableModel.push(model);

            const metadata: ControllerMetadata = Reflect.getMetadata("controller:metadata", Object.getPrototypeOf(controllerInstance));

            app.use(metadata.basePath, router);
         }

         const catchAll: RequestHandler | RequestHandler[] | undefined = appConfig.catchAll;

         catchAll && app.use("*", catchAll);

         const errorHandler: ErrorRequestHandler | ErrorRequestHandler[] | undefined = appConfig.errorHandler;

         errorHandler && app.use(errorHandler);

         verbose === "detailed"
            ? printableModel && pathMap.displayDetailedPathMap(printableModel)
            : verbose === "minimal"
            ? pathMap.displayPathMap(app)
            : null;

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
