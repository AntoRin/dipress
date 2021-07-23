import { buildParamDecorator } from "../factories/buildParamDecorator";

export function Err(objectKey?: string) {
   return buildParamDecorator("error", objectKey);
}
