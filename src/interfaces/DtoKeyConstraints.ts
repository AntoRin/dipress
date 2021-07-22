export interface DtoKeyConstraints {
   name: string;
   type: "bigint" | "boolean" | "function" | "number" | "object" | "string" | "symbol" | "undefined";
   required?: boolean;
   minLength?: number;
   maxLength?: number;
   checkType?: boolean;
   range?: number[];
}
