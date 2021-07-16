import { ArgEntity } from "../interfaces/ArgEntity";
import { HandlerCtxField } from "../types";

export function buildParamDecorator(decoratorType: HandlerCtxField, objectKey?: string) {
   switch (decoratorType) {
      case "context": {
         return function (target: Object, key: string, index: number) {
            const requiredArg: ArgEntity = {
               index,
               argModel: [
                  { type: "context" },
                  ...(Reflect.getMetadata("method:param", target, key)?.argModel || ([] as ArgEntity["argModel"])),
               ],
            };

            Reflect.defineMetadata("method:param", requiredArg, target, key);
         };
      }
      case "body": {
         return function (target: Object, key: string, index: number) {
            const requiredArg: ArgEntity = {
               index,
               argModel: [
                  { type: "body", key: objectKey },
                  ...(Reflect.getMetadata("method:param", target, key)?.argModel || ([] as ArgEntity["argModel"])),
               ],
            };

            Reflect.defineMetadata("method:param", requiredArg, target, key);
         };
      }
      case "param": {
         return function (target: Object, key: string, index: number) {
            const requiredArg: ArgEntity = {
               index,
               argModel: [
                  { type: "param", key: objectKey },
                  ...(Reflect.getMetadata("method:param", target, key)?.argModel || ([] as ArgEntity["argModel"])),
               ],
            };

            Reflect.defineMetadata("method:param", requiredArg, target, key);
         };
      }

      case "query": {
         return function (target: Object, key: string, index: number) {
            const requiredArg: ArgEntity = {
               index,
               argModel: [
                  { type: "query", key: objectKey },
                  ...(Reflect.getMetadata("method:param", target, key)?.argModel || ([] as ArgEntity["argModel"])),
               ],
            };

            Reflect.defineMetadata("method:param", requiredArg, target, key);
         };
      }
   }
}
