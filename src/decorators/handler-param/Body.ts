import { buildParamDecorator } from "./factories/buildParamDecorator";

export function Body(objectKey?: string) {
   return buildParamDecorator("body", objectKey);
}
