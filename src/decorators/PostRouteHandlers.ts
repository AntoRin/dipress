import "reflect-metadata";
import { RouteData } from "../types";
import { isFunction } from "../utils/functionCheck";

export function PostRouteHandlers(handlers: Array<Function>) {
   return function (target: any, key: string, _: PropertyDescriptor) {
      if (!isFunction(handlers))
         throw new Error("Only functions are to be passed in for handlers");

      const postHandlerMetaData: RouteData = {
         ...Reflect.getMetadata("route", target, key),
         postRouteHandlers: handlers,
      };

      Reflect.defineMetadata("route", postHandlerMetaData, target, key);
   };
}
