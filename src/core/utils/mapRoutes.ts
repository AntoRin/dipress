import { RequestHandler, Router } from "express";
import { ControllerMetadata } from "../interfaces/ControllerMetadata";
import { ControllerModel, EndPoint } from "../interfaces/ControllerModel";
import { RouteData } from "../interfaces/RouteData";

export function createMappedRouter(controllerInstance: any): { router: Router; model: ControllerModel } {
   const router: Router = Router();

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
      router.use(controllerMetadata.entryHandlers);
      controllerInfo.entryMiddleware = [
         ...controllerInfo.entryMiddleware,
         ...controllerMetadata.entryHandlers.map(handler => handler.name),
      ];
   }

   for (const propName of Object.getOwnPropertyNames(Object.getPrototypeOf(controllerInstance))) {
      if (typeof controllerInstance[propName] !== "function" || propName === "constructor") continue;

      const metaData: RouteData | undefined = Reflect.getMetadata("route", controllerInstance, propName);

      if (!metaData) continue;

      let thisEndpoint: EndPoint = {
         path: metaData.endPoint,
         handlerName: propName,
         method: "GET",
         entryMiddleware: [],
         exitMiddleware: [],
      };

      if (metaData.preRouteHandlers) {
         router.use(`${metaData.endPoint}`, metaData.preRouteHandlers);
         thisEndpoint.entryMiddleware = [...thisEndpoint.entryMiddleware, ...metaData.preRouteHandlers.map(handler => handler.name)];
      }

      const endPointHandler: RequestHandler[] = ([] as RequestHandler[]).concat(
         Reflect.getMetadata("isFactory", controllerInstance, propName)
            ? controllerInstance[propName].apply(controllerInstance, [])
            : controllerInstance[propName].bind(controllerInstance)
      );

      switch (metaData.method) {
         case "get":
            router.get(metaData.endPoint, endPointHandler);
            thisEndpoint.method = "GET";
            break;
         case "post":
            router.post(metaData.endPoint, endPointHandler);
            thisEndpoint.method = "POST";
            break;
         case "put":
            router.put(metaData.endPoint, endPointHandler);
            thisEndpoint.method = "PUT";
            break;
         case "delete":
            router.delete(metaData.endPoint, endPointHandler);
            thisEndpoint.method = "DELETE";
            break;
      }

      if (metaData.postRouteHandlers) {
         router.use(`${metaData.endPoint}`, metaData.postRouteHandlers);
         thisEndpoint.exitMiddleware = [...thisEndpoint.exitMiddleware, ...metaData.postRouteHandlers.map(handler => handler.name)];
      }

      controllerInfo.endPoints.push(thisEndpoint);
   }

   if (controllerMetadata.exitHandlers && controllerMetadata.exitHandlers.length > 0) {
      router.use(controllerMetadata.exitHandlers);
      controllerInfo.exitMiddleware = [
         ...controllerInfo.exitMiddleware,
         ...controllerMetadata.exitHandlers.map(handler => handler.name),
      ];
   }

   return {
      router,
      model: controllerInfo,
   };
}
