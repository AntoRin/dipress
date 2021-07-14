import { ControllerMetadata } from "core/interfaces/ControllerMetadata";
import { RouteData } from "core/interfaces/RouteData";
import { RequestHandler, Router } from "express";

export function createMappedRouter(controllerInstance: any): Router {
   const router: Router = Router();

   const controllerMetadata: ControllerMetadata = Reflect.getMetadata(
      "controller:metadata",
      Object.getPrototypeOf(controllerInstance)
   );

   controllerMetadata.entryHandlers && controllerMetadata.entryHandlers.length > 0 && router.use(controllerMetadata.entryHandlers);

   for (const propName of Object.getOwnPropertyNames(Object.getPrototypeOf(controllerInstance))) {
      if (typeof controllerInstance[propName] !== "function" || propName === "constructor") continue;

      const metaData: RouteData | undefined = Reflect.getMetadata("route", controllerInstance, propName);

      if (!metaData) continue;

      metaData.preRouteHandlers && router.use(`${metaData.endPoint}`, metaData.preRouteHandlers);

      const endPointHandler: RequestHandler[] = ([] as RequestHandler[]).concat(
         Reflect.getMetadata("isFactory", controllerInstance, propName)
            ? controllerInstance[propName].apply(controllerInstance, [])
            : controllerInstance[propName].bind(controllerInstance)
      );

      switch (metaData.method) {
         case "get":
            router.get(metaData.endPoint, endPointHandler);
            break;
         case "post":
            router.post(metaData.endPoint, endPointHandler);
            break;
         case "put":
            router.put(metaData.endPoint, endPointHandler);
            break;
         case "delete":
            router.delete(metaData.endPoint, endPointHandler);
            break;
      }

      metaData.postRouteHandlers && router.use(metaData.endPoint, metaData.postRouteHandlers);
   }

   controllerMetadata.exitHandlers && controllerMetadata.exitHandlers.length > 0 && router.use(controllerMetadata.exitHandlers);

   return router;
}
