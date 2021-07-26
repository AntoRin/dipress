import { buildParamDecorator } from "./factories/buildParamDecorator";

export function Params(objectKey?: string) {
   return buildParamDecorator("param", objectKey);
}
