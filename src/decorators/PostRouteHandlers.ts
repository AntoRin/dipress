import { RequestHandler } from "express";
import "reflect-metadata";
import { RouteData } from "../types";
import { isFunction } from "../utils/functionCheck";

export function PostRouteHandlers(
   handlers: RequestHandler | Array<RequestHandler>
) {
   return function (target: Object, key: string, _: PropertyDescriptor) {
      if (!isFunction(handlers))
         throw new Error("Only functions are to be passed in for handlers");

      const postHandlerMetaData: RouteData = {
         ...Reflect.getMetadata("route", target, key),
         postRouteHandlers: ([] as Array<RequestHandler>).concat(handlers),
      };

      Reflect.defineMetadata("route", postHandlerMetaData, target, key);
   };
}
