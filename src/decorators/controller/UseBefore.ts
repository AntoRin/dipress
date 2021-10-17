import { RequestHandler } from "express";
import { handleMethodRequestEntry } from "./helpers/methodEntry";
import { handleControllerRequestEntry } from "./helpers/controllerEntry";

/**
 * @category Controller
 * @decorator UseBefore
 * * Accepts a list of RequestHandler for use before an endpoint.
 */
export function UseBefore(handlers: RequestHandler | Array<RequestHandler>) {
   return function (decoratee: Function | Object, key?: string, descriptor?: PropertyDescriptor) {
      if (typeof decoratee === "function") {
         handleControllerRequestEntry(handlers, decoratee);
      } else {
         handleMethodRequestEntry(handlers, decoratee, key!, descriptor!);
      }
   };
}
