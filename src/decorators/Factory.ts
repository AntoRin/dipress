import "reflect-metadata";
import { RouteData } from "../types";

export function Factory(target: any, key: string, _: PropertyDescriptor) {
   const routeData: RouteData = {
      ...Reflect.getMetadata("route", target, key),
      isFactory: true,
   };
   Reflect.defineMetadata("route", routeData, target, key);
}
