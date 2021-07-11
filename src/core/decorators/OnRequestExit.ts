import { RequestHandler } from "express";
import "reflect-metadata";
import { handleControllerRequestExit } from "../utils/controllerExit";
import { handleMethodRequestExit } from "../utils/methodExit";

export function OnRequestExit(handlers: RequestHandler | Array<RequestHandler>) {
   return function (decoratee: Function | Object, key?: string, descriptor?: PropertyDescriptor) {
      if (typeof decoratee === "function") {
         handleControllerRequestExit(handlers, decoratee);
      } else {
         handleMethodRequestExit(handlers, decoratee, key!, descriptor!);
      }
   };
}
