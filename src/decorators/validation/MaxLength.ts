import { DtoConstraints } from "../../interfaces/DtoConstraints";
import { DtoKeyConstraints } from "../../interfaces/DtoKeyConstraints";

export function MaxLength(constraint: number) {
   return function (target: any, key: string) {
      const prevDtoConstraints: DtoConstraints | undefined = Reflect.getMetadata("dto:validation", target);

      const prevArgConstraints: DtoKeyConstraints | undefined = prevDtoConstraints ? prevDtoConstraints[key] : undefined;

      if (prevArgConstraints?.minLength) return;

      const paramConstraints: DtoKeyConstraints = {
         ...(prevArgConstraints || {}),
         maxLength: constraint,
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
