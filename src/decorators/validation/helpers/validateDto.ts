import { DtoConstraints } from "../../../interfaces/DtoConstraints";
import { DtoKeyConstraints } from "../../../interfaces/DtoKeyConstraints";
import { ObjectConstructor } from "../../../types";

export function validateDto(dto: any, dtoType: ObjectConstructor<any>): boolean {
   const constrainedKeys: DtoConstraints | undefined = Reflect.getMetadata("dto:validation", dtoType.prototype);

   if (!constrainedKeys) return true;

   const isNotValid: boolean = Object.getOwnPropertyNames(constrainedKeys).some((constrainedKeyName: string) => {
      const keyConstraints: DtoKeyConstraints = constrainedKeys[constrainedKeyName];
      const value: unknown = dto[keyConstraints.name];

      if (!value && keyConstraints.required) return true;
      else if (value) {
         const dtoTypeMod: string = typeof value === "object" ? (Array.isArray(value) ? "array" : typeof value) : typeof value;

         if (keyConstraints.checkType && dtoTypeMod !== keyConstraints.type.toLowerCase()) {
            return true;
         }

         if (keyConstraints.maxLength && (value as string | any[]).length > keyConstraints.maxLength) {
            return true;
         }

         if (keyConstraints.minLength && (value as string | any[]).length < keyConstraints.minLength) {
            return true;
         }

         if (keyConstraints.type === "number" && typeof value === "number" && keyConstraints.range) {
            if (value < keyConstraints.range[0] || value > keyConstraints.range[1]) return true;
         }
      }

      return false;
   });

   if (isNotValid) return false;
   else return true;
}
