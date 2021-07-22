import { DtoConstraints } from "../interfaces/DtoConstraints";
import { DtoKeyConstraints } from "../interfaces/DtoKeyConstraints";

export function validateDto(dto: any, dtoType: any): boolean {
   const constrainedKeys: DtoConstraints | undefined = Reflect.getMetadata("dto:validation", dtoType.prototype);

   if (!constrainedKeys) return true;

   const isNotValid: boolean = Object.getOwnPropertyNames(constrainedKeys).some(constraint => {
      const key: DtoKeyConstraints = constrainedKeys[constraint];
      const value: any = dto[key.name];

      if (!value && key.required) return true;
      else if (value) {
         const dtoTypeMod: string = typeof value === "object" ? (Array.isArray(value) ? "array" : typeof value) : typeof value;

         if (key.checkType && dtoTypeMod !== key.type.toLowerCase()) {
            return true;
         }

         if (key.maxLength && (value as string | any[]).length > key.maxLength) {
            return true;
         }

         if (key.minLength && (value as string | any[]).length < key.minLength) {
            return true;
         }

         if (key.type === "number" && key.range) {
            if (value < key.range[0] || value > key.range[1]) return true;
         }
      }

      return false;
   });

   if (isNotValid) return false;
   else return true;
}
