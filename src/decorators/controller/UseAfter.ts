import { RequestHandler } from "express";
import { handleControllerRequestExit } from "./helpers/controllerExit";
import { handleMethodRequestExit } from "./helpers/methodExit";

/**
 * @category Controller
 * @decorator UseAfter
 * * Accepts a list of RequestHandler for use after an endpoint.
 */
export function UseAfter(handlers: RequestHandler | Array<RequestHandler>) {
   return function (decoratee: Function | Object, key?: string, descriptor?: PropertyDescriptor) {
      if (typeof decoratee === "function") {
         handleControllerRequestExit(handlers, decoratee);
      } else {
         handleMethodRequestExit(handlers, decoratee, key!, descriptor!);
      }
   };
}
