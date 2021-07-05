import "reflect-metadata";
import { RouteData } from "../types";

export function PreHandlers(handlers: Array<Function>) {
   return function (target: any, key: string, _: PropertyDescriptor) {
      const preHandlerMetaData: RouteData = {
         ...Reflect.getMetadata("route", target, key),
         preHandlers: handlers,
      };

      Reflect.defineMetadata("route", preHandlerMetaData, target, key);
   };
}
