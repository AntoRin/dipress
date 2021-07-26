import { buildParamDecorator } from "./factories/buildParamDecorator";

export function Next(objectKey?: string) {
   return buildParamDecorator("next", objectKey);
}
