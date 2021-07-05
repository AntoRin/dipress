import "reflect-metadata";
import { RouteData } from "../types";

export function PostHandlers(handlers: Array<any>) {
   return function (target: any, key: string, _: PropertyDescriptor) {
      const postHandlerMetaData: RouteData = {
         ...Reflect.getMetadata("route", target, key),
         postHandlers: handlers,
      };

      console.log(postHandlerMetaData);

      Reflect.defineMetadata("route", postHandlerMetaData, target, key);
   };
}
