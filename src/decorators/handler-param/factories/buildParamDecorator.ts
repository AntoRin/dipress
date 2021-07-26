import { ArgEntity } from "../../../interfaces/ArgEntity";
import { HandlerCtxField } from "../../../types";

export function buildParamDecorator(decoratorType: HandlerCtxField, objectKey?: string) {
   return function (target: Object, key: string, index: number) {
      const requiredArg: ArgEntity = {
         argModel: [
            { type: decoratorType, key: objectKey, index },
            ...(Reflect.getMetadata("method:param", target, key)?.argModel || ([] as ArgEntity["argModel"])),
         ],
      };

      Reflect.defineMetadata("method:param", requiredArg, target, key);
   };
}
