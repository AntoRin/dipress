import { RequestHandler } from "express";
import "reflect-metadata";
import { RouteData } from "../types";
import { isFunction } from "../utils/functionCheck";

export function PreRouteHandlers(
   handlers: RequestHandler | Array<RequestHandler>
) {
   return function (target: Object, key: string, _: PropertyDescriptor) {
      if (!isFunction(handlers))
         throw new Error("Only functions are to be passed in for handlers");

      const preHandlerMetaData: RouteData = {
         ...Reflect.getMetadata("route", target, key),
         preRouteHandlers: ([] as Array<RequestHandler>).concat(handlers),
      };

      Reflect.defineMetadata("route", preHandlerMetaData, target, key);
   };
}
