import { DtoConstraints } from "../../interfaces/DtoConstraints";
import { DtoKeyConstraints } from "../../interfaces/DtoKeyConstraints";

/**
 * @category DTO-validation
 * @decorator Required
 */
export function Required() {
   return function (target: any, key: string) {
      const paramConstraints: DtoKeyConstraints = {
         ...((Reflect.getMetadata("dto:validation", target) && Reflect.getMetadata("dto:validation", target)[key]) || {}),
         required: true,
         name: key,
         type: Reflect.getMetadata("design:type", target, key).name,
      };

      const updatedMetadata: DtoConstraints = {
         ...(Reflect.getMetadata("dto:validation", target) || {}),
         [key]: paramConstraints,
      };

      Reflect.defineMetadata("dto:validation", updatedMetadata, target);
   };
}
