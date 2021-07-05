import "reflect-metadata";
import { RouteData } from "../types";

export function GET(route: string) {
   return function (target: any, key: string, _: PropertyDescriptor) {
      const routeDetails: RouteData = {
         ...Reflect.getMetadata("route", target, key),
         endPoint: route,
         method: "get",
      };

      console.log(routeDetails);

      Reflect.defineMetadata("route", routeDetails, target, key);
   };
}

export function POST(route: string) {
   return function (target: any, key: string, _: PropertyDescriptor) {
      const routeDetails: RouteData = {
         ...Reflect.getMetadata("route", target, key),
         endPoint: route,
         method: "post",
      };

      Reflect.defineMetadata("route", routeDetails, target, key);
   };
}

export function PUT(route: string) {
   return function (target: any, key: string, _: PropertyDescriptor) {
      const routeDetails: RouteData = {
         ...Reflect.getMetadata("route", target, key),
         endPoint: route,
         method: "put",
      };

      Reflect.defineMetadata("route", routeDetails, target, key);
   };
}

export function DELETE(route: string) {
   return function (target: any, key: string, _: PropertyDescriptor) {
      const routeDetails: RouteData = {
         ...Reflect.getMetadata("route", target, key),
         endPoint: route,
         method: "delete",
      };

      Reflect.defineMetadata("route", routeDetails, target, key);
   };
}
