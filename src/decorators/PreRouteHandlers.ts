import "reflect-metadata";
import { RouteData } from "../types";
import { isFunction } from "../utils/functionCheck";

export function PreRouteHandlers(handlers: Array<Function>) {
   return function (target: any, key: string, _: PropertyDescriptor) {
      if (!isFunction(handlers))
         throw new Error("Only functions are to be passed in for handlers");

      const preHandlerMetaData: RouteData = {
         ...Reflect.getMetadata("route", target, key),
         preRouteHandlers: handlers,
      };

      Reflect.defineMetadata("route", preHandlerMetaData, target, key);
   };
}
