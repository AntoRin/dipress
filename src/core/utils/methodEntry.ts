import { RequestHandler } from "express";
import "reflect-metadata";
import { RouteData } from "core/interfaces/RouteData";
import { isFunctionTypeOnly } from "./functionCheck";

export function handleMethodRequestEntry(
   handlers: RequestHandler | Array<RequestHandler>,
   target: Object,
   key: string,
   _: PropertyDescriptor
) {
   if (!isFunctionTypeOnly(handlers)) throw new Error("Only functions are to be passed in for handlers");

   const preHandlerMetaData: RouteData = {
      ...Reflect.getMetadata("route", target, key),
      preRouteHandlers: ([] as Array<RequestHandler>).concat(handlers),
   };

   Reflect.defineMetadata("route", preHandlerMetaData, target, key);
}
