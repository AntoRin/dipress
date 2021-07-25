import { RequestHandler } from "express";
import { RouteData } from "../../interfaces/RouteData";
import { isFunctionTypeOnly } from "../../utils/functionCheck";

export function handleMethodRequestEntry(
   handlers: RequestHandler | RequestHandler[],
   target: Object,
   key: string,
   _: PropertyDescriptor
) {
   if (!isFunctionTypeOnly(handlers)) throw new Error("Only functions are to be passed in for handlers");

   const preHandlerMetaData: RouteData = {
      ...Reflect.getMetadata("route", target, key),
      preRouteHandlers: ([] as RequestHandler[]).concat(handlers),
   };

   Reflect.defineMetadata("route", preHandlerMetaData, target, key);
}
