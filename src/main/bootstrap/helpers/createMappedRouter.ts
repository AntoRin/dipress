import { NextFunction, Request, RequestHandler, Response, Router } from "express";
import { ArgEntity } from "../../../interfaces/ArgEntity";
import { ControllerMetadata } from "../../../interfaces/ControllerMetadata";
import { ControllerModel, EndPoint } from "../../../interfaces/ControllerModel";
import { RouteData } from "../../../interfaces/RouteData";

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

      if (!metaData || !metaData.endPoint) continue;

      let thisEndpoint: EndPoint = {
         path: metaData.endPoint,
         handlerName: propName,
         method: "GET",
         entryMiddleware: [],
         exitMiddleware: [],
      };

      if (metaData.preRouteHandlers) {
         router.use(metaData.endPoint, metaData.preRouteHandlers);
         thisEndpoint.entryMiddleware = [...thisEndpoint.entryMiddleware, ...metaData.preRouteHandlers.map(handler => handler.name)];
      }

      let endPointHandler: RequestHandler | RequestHandler[] | null = null;

      if (Reflect.getMetadata("isFactory", controllerInstance, propName)) {
         endPointHandler = ([] as RequestHandler[]).concat(controllerInstance[propName].apply(controllerInstance, []));
      } else {
         endPointHandler = function (req: Request, res: Response, next: NextFunction) {
            let methodArguments: any[] = [];

            const argEntity: ArgEntity | undefined = Reflect.getMetadata("method:param", controllerInstance, propName);

            if (argEntity) {
               const argTypes: ArgEntity["argModel"] = argEntity.argModel;

               argTypes.forEach(param => {
                  switch (param.type) {
                     case "context":
                        methodArguments.push({
                           req,
                           res,
                           next,
                        });
                        break;
                     case "body":
                        methodArguments.push(param.key ? req.body[param.key] : req.body);
                        break;
                     case "param":
                        methodArguments.push(param.key ? req.params[param.key] : req.params);
                        break;
                     case "query":
                        methodArguments.push(param.key ? req.query[param.key] : req.query);
                        break;
                  }
               });
            }

            const methodResult = controllerInstance[propName].apply(controllerInstance, methodArguments);

            if (!res.headersSent)
               switch (typeof methodResult) {
                  case "string":
                     return res.send(methodResult);
                  case "object":
                     return res.json(methodResult);
                  case "bigint":
                  case "boolean":
                  case "number":
                     return res.send(methodResult.toString());
                  case "undefined":
                     break;
                  default:
                     return res.end();
               }
         };
      }

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
