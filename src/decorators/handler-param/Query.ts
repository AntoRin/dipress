import { buildParamDecorator } from "../factories/buildParamDecorator";

export function Query(objectKey?: string) {
   return buildParamDecorator("query", objectKey);
}
