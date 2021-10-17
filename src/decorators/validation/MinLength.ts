import { DtoConstraints } from "../../interfaces/DtoConstraints";
import { DtoKeyConstraints } from "../../interfaces/DtoKeyConstraints";

/**
 * @category DTO-validation
 * @decorator MinLength
 */
export function MinLength(constraint: number) {
   return function (target: any, key: string) {
      const prevDtoConstraints: DtoConstraints | undefined = Reflect.getMetadata("dto:validation", target);

      const prevArgConstraints: DtoKeyConstraints | undefined = prevDtoConstraints ? prevDtoConstraints[key] : undefined;

      if (prevArgConstraints?.maxLength) return;

      const paramConstraints: DtoKeyConstraints = {
         ...(prevArgConstraints || {}),
         minLength: constraint,
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
