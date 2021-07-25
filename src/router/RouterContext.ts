import { ErrorRequestHandler, RequestHandler, Router } from "express";
import { ControllerMetadata } from "../interfaces/ControllerMetadata";
import { ControllerModel, EndPoint } from "../interfaces/ControllerModel";
import { RouteData } from "../interfaces/RouteData";
import { responseContext } from "./ResponseContext";

export class RouterContext {
   private router: Router;

   public constructor() {
      this.router = Router();
   }

   public createMappedRouter(controllerInstance: any): { router: Router; model: ControllerModel } {
      let controllerInfo: ControllerModel = {
         controllerName: controllerInstance.constructor.name,
         entryMiddleware: [],
         exitMiddleware: [],
         endPoints: [],
      };

      const controllerMetadata: ControllerMetadata = Reflect.getMetadata(
         "controller:metadata",
         Object.getPrototypeOf(controllerInstance)
      );

      if (controllerMetadata.entryHandlers && controllerMetadata.entryHandlers.length > 0) {
         this.router.use(controllerMetadata.entryHandlers);
         controllerInfo.entryMiddleware = [
            ...controllerInfo.entryMiddleware,
            ...controllerMetadata.entryHandlers.map(handler => handler.name),
         ];
      }

      let errorHandler: ErrorRequestHandler | null = null;

      for (const propName of Object.getOwnPropertyNames(Object.getPrototypeOf(controllerInstance))) {
         if (typeof controllerInstance[propName] !== "function" || propName === "constructor") continue;

         if (Reflect.getMetadata("error-handler", controllerInstance, propName)) {
            if (!errorHandler && !Reflect.getMetadata("errorHandler:active", controllerInstance)) {
               errorHandler = Reflect.getMetadata("isFactory", controllerInstance, propName)
                  ? (controllerInstance[propName] as Function).apply(controllerInstance, [])
                  : responseContext.createErrorResponseHandler(propName, controllerInstance);
            }
            Reflect.defineMetadata("errorHandler:active", true, controllerInstance);

            continue;
         }

         const metaData: RouteData | undefined = Reflect.getMetadata("route", controllerInstance, propName);

         if (!metaData || !metaData.endPoint) continue;

         let thisEndpoint: EndPoint = {
            path: metaData.endPoint,
            handlerName: propName,
            method: "get",
            entryMiddleware: [],
            exitMiddleware: [],
         };

         if (metaData.preRouteHandlers) {
            this.router.use(metaData.endPoint, metaData.preRouteHandlers);
            thisEndpoint.entryMiddleware = [
               ...thisEndpoint.entryMiddleware,
               ...metaData.preRouteHandlers.map(handler => handler.name),
            ];
         }

         let endPointHandler: RequestHandler | RequestHandler[] | null = null;

         if (Reflect.getMetadata("isFactory", controllerInstance, propName)) {
            endPointHandler = ([] as RequestHandler[]).concat(controllerInstance[propName].apply(controllerInstance, []));
         } else {
            endPointHandler = responseContext.createResponseHandler(propName, controllerInstance);
         }

         switch (metaData.method) {
            case "get":
               this.router.get(metaData.endPoint, endPointHandler);
               thisEndpoint.method = "GET";
               break;
            case "post":
               this.router.post(metaData.endPoint, endPointHandler);
               thisEndpoint.method = "POST";
               break;
            case "put":
               this.router.put(metaData.endPoint, endPointHandler);
               thisEndpoint.method = "PUT";
               break;
            case "delete":
               this.router.delete(metaData.endPoint, endPointHandler);
               thisEndpoint.method = "DELETE";
               break;
         }

         if (metaData.postRouteHandlers) {
            this.router.use(metaData.endPoint, metaData.postRouteHandlers);
            thisEndpoint.exitMiddleware = [...thisEndpoint.exitMiddleware, ...metaData.postRouteHandlers.map(handler => handler.name)];
         }

         controllerInfo.endPoints.push(thisEndpoint);
      }

      if (controllerMetadata.exitHandlers && controllerMetadata.exitHandlers.length > 0) {
         this.router.use(controllerMetadata.exitHandlers);
         controllerInfo.exitMiddleware = [
            ...controllerInfo.exitMiddleware,
            ...controllerMetadata.exitHandlers.map(handler => handler.name),
         ];
      }

      if (errorHandler) this.router.use(errorHandler);

      return {
         router: this.router,
         model: controllerInfo,
      };
   }
}
