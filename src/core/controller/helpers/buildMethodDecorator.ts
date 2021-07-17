import { RouteData } from "../../interfaces/RouteData";

export function buildMethodDecorator(methodType: string, route: string) {
   return function (target: Object, key: string, _: PropertyDescriptor): void {
      const routeDetails: RouteData = {
         ...Reflect.getMetadata("route", target, key),
         endPoint: route,
         method: methodType,
      };

      Reflect.defineMetadata("route", routeDetails, target, key);
   };
}
