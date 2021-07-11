import "reflect-metadata";
import { RequestHandler } from "express";
import { handleMethodRequestEntry } from "../utils/methodEntry";
import { handleControllerRequestEntry } from "../utils/controllerEntry";

export function OnRequestEntry(handlers: RequestHandler | Array<RequestHandler>) {
   return function (decoratee: Function | Object, key?: string, descriptor?: PropertyDescriptor) {
      if (typeof decoratee === "function") {
         handleControllerRequestEntry(handlers, decoratee);
      } else {
         handleMethodRequestEntry(handlers, decoratee, key!, descriptor!);
      }
   };
}
