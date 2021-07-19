import { buildParamDecorator } from "./helpers/buildParamDecorator";

export function Body(objectKey?: string) {
   return buildParamDecorator("body", objectKey);
}
