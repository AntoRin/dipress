import "reflect-metadata";
import { RouteData } from "../interfaces/RouteData";

/**
 *
 * @param route: string
 * * Use the decorated method as a handler for GET requests to the route.
 */
export function GET(route: string) {
   return function (target: Object, key: string, _: PropertyDescriptor): void {
      const routeDetails: RouteData = {
         ...Reflect.getMetadata("route", target, key),
         endPoint: route,
         method: "get",
      };

      Reflect.defineMetadata("route", routeDetails, target, key);
   };
}

/**
 *
 * @param route: string
 * * Use the decorated method as a handler for POST requests to the route.
 */
export function POST(route: string) {
   return function (target: Object, key: string, _: PropertyDescriptor): void {
      const routeDetails: RouteData = {
         ...Reflect.getMetadata("route", target, key),
         endPoint: route,
         method: "post",
      };

      Reflect.defineMetadata("route", routeDetails, target, key);
   };
}

/**
 *
 * @param route: string
 * * Use the decorated method as a handler for PUT requests to the route.
 */
export function PUT(route: string) {
   return function (target: Object, key: string, _: PropertyDescriptor): void {
      const routeDetails: RouteData = {
         ...Reflect.getMetadata("route", target, key),
         endPoint: route,
         method: "put",
      };

      Reflect.defineMetadata("route", routeDetails, target, key);
   };
}

/**
 *
 * @param route: string
 * * Use the decorated method as a handler for DELETE requests to the route.
 */
export function DELETE(route: string) {
   return function (target: Object, key: string, _: PropertyDescriptor): void {
      const routeDetails: RouteData = {
         ...Reflect.getMetadata("route", target, key),
         endPoint: route,
         method: "delete",
      };

      Reflect.defineMetadata("route", routeDetails, target, key);
   };
}
