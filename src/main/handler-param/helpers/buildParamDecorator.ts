import { ArgEntity } from "../../../interfaces/ArgEntity";
import { HandlerCtxField } from "../../../index";

export function buildParamDecorator(decoratorType: HandlerCtxField, objectKey?: string) {
   return function (target: Object, key: string, index: number) {
      const requiredArg: ArgEntity = {
         index,
         argModel: [
            { type: decoratorType, key: objectKey },
            ...(Reflect.getMetadata("method:param", target, key)?.argModel || ([] as ArgEntity["argModel"])),
         ],
      };

      Reflect.defineMetadata("method:param", requiredArg, target, key);
   };
}
