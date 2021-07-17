import "reflect-metadata";
import { RequestHandler } from "express";
import { RouteData } from "../../../interfaces/RouteData";
import { isFunctionTypeOnly } from "../../../utils/functionCheck";

export function handleMethodRequestExit(
   handlers: RequestHandler | Array<RequestHandler>,
   target: Object,
   key: string,
   _: PropertyDescriptor
) {
   if (!isFunctionTypeOnly(handlers)) throw new Error("Only functions are to be passed in for handlers");

   const postHandlerMetaData: RouteData = {
      ...Reflect.getMetadata("route", target, key),
      postRouteHandlers: ([] as Array<RequestHandler>).concat(handlers),
   };

   Reflect.defineMetadata("route", postHandlerMetaData, target, key);
}
