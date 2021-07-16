import { buildParamDecorator } from "../utils/buildParamDecorator";

export function Body(objectKey?: string) {
   return buildParamDecorator("body", objectKey);
}
