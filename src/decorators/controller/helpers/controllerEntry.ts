import { RequestHandler } from "express";
import { isFunctionTypeOnly } from "../../../utils/functionCheck";
import { ControllerMetadata } from "../../../interfaces/ControllerMetadata";

export function handleControllerRequestEntry(middlewares: RequestHandler | RequestHandler[], constructor: Function) {
   if (!isFunctionTypeOnly(middlewares)) throw new Error("Only functions are to be passed in for handlers");

   const target: any = constructor.prototype;

   const controllerMetadata: ControllerMetadata = Reflect.getMetadata("controller:metadata", target);

   if (controllerMetadata) {
      const updatedMetadata: ControllerMetadata = {
         ...controllerMetadata,
         entryHandlers: [...(Array.isArray(middlewares) ? middlewares : [middlewares])],
      };

      Reflect.defineMetadata("controller:metadata", updatedMetadata, target);
   } else {
      Reflect.defineMetadata("controller-middleware", ([] as RequestHandler[]).concat(middlewares), target);
   }
}
