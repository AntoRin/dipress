import { ErrorRequestHandler, RequestHandler, Router } from "express";
import { ControllerMetadata } from "../interfaces/ControllerMetadata";
import { ControllerModel, EndPoint } from "../interfaces/ControllerModel";
import { RouteData } from "../interfaces/RouteData";
import { responseContext } from "./ResponseContext";

export class RouterContext {
   private router: Router;
   private _controllerInstance: any;
   private _controllerMap: ControllerModel;

   public constructor(controllerInstance: any) {
      this.router = Router();
      this._controllerInstance = controllerInstance;
      this._controllerMap = {
         controllerName: controllerInstance.constructor.name,
         entryMiddleware: [],
         exitMiddleware: [],
         endPoints: [],
      };
   }

   public createMappedRouter(): { router: Router; model: ControllerModel } {
      const controllerMetadata: ControllerMetadata = Reflect.getMetadata(
         "controller:metadata",
         Object.getPrototypeOf(this._controllerInstance)
      );

      if (controllerMetadata.entryHandlers && controllerMetadata.entryHandlers.length > 0) {
         this.router.use(controllerMetadata.entryHandlers);
         this._controllerMap.entryMiddleware = [
            ...this._controllerMap.entryMiddleware,
            ...controllerMetadata.entryHandlers.map(handler => handler.name),
         ];
      }

      let errorHandler: ErrorRequestHandler | null = null;

      for (const propName of Object.getOwnPropertyNames(Object.getPrototypeOf(this._controllerInstance))) {
         if (typeof this._controllerInstance[propName] !== "function" || propName === "constructor") continue;

         if (Reflect.getMetadata("error-handler", this._controllerInstance, propName)) {
            if (!errorHandler && !Reflect.getMetadata("errorHandler:active", this._controllerInstance)) {
               errorHandler = Reflect.getMetadata("isFactory", this._controllerInstance, propName)
                  ? (this._controllerInstance[propName] as Function).apply(this._controllerInstance, [])
                  : responseContext.createErrorResponseHandler(propName, this._controllerInstance);
            }
            Reflect.defineMetadata("errorHandler:active", true, this._controllerInstance);

            continue;
         }

         const metaData: RouteData | undefined = Reflect.getMetadata("route", this._controllerInstance, propName);

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

         if (Reflect.getMetadata("isFactory", this._controllerInstance, propName)) {
            endPointHandler = ([] as RequestHandler[]).concat(this._controllerInstance[propName].apply(this._controllerInstance, []));
         } else {
            endPointHandler = responseContext.createResponseHandler(propName, this._controllerInstance);
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
            case "all":
               this.router.all(metaData.endPoint, endPointHandler);
               thisEndpoint.method = "DELETE";
               break;
         }

         if (metaData.postRouteHandlers) {
            this.router.use(metaData.endPoint, metaData.postRouteHandlers);
            thisEndpoint.exitMiddleware = [...thisEndpoint.exitMiddleware, ...metaData.postRouteHandlers.map(handler => handler.name)];
         }

         this._controllerMap.endPoints.push(thisEndpoint);
      }

      if (controllerMetadata.exitHandlers && controllerMetadata.exitHandlers.length > 0) {
         this.router.use(controllerMetadata.exitHandlers);
         this._controllerMap.exitMiddleware = [
            ...this._controllerMap.exitMiddleware,
            ...controllerMetadata.exitHandlers.map(handler => handler.name),
         ];
      }

      if (errorHandler) this.router.use(errorHandler);

      return {
         router: this.router,
         model: this._controllerMap,
      };
   }
}
