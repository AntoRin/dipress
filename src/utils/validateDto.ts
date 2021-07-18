import { DtoConstraints } from "../interfaces/DtoConstraints";
import { DtoKey } from "../interfaces/DtoKey";

export function validateDto(dto: any, dtoType: any): boolean {
   const constrainedKeys: DtoConstraints | undefined = Reflect.getMetadata("validation:required", dtoType.prototype);

   if (!constrainedKeys) return true;

   const isNotValid: boolean = Object.getOwnPropertyNames(constrainedKeys).some(constraint => {
      const key: DtoKey = constrainedKeys[constraint];
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
      }

      return false;
   });

   if (isNotValid) return false;
   else return true;
}
