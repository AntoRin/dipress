export interface DtoKeyConstraints {
   name: string;
   type: string;
   required?: boolean;
   minLength?: number;
   maxLength?: number;
   checkType?: boolean;
}
