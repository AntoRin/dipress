import { DtoConstraints } from "../../interfaces/DtoConstraints";
import { DtoKey } from "../../interfaces/DtoKey";

export function CheckType() {
   return function (target: any, key: string) {
      const paramConstraints: DtoKey = {
         ...((Reflect.getMetadata("validation:required", target) && Reflect.getMetadata("validation:required", target)[key]) || {}),
         checkType: true,
         name: key,
         type: Reflect.getMetadata("design:type", target, key).name,
      };

      const updatedMetadata: DtoConstraints = {
         ...(Reflect.getMetadata("validation:required", target) || {}),
         [key]: paramConstraints,
      };

      Reflect.defineMetadata("validation:required", updatedMetadata, target);
   };
}
