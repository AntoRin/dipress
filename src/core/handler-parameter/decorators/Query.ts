import { buildParamDecorator } from "../helpers/buildParamDecorator";

export function Query(objectKey?: string) {
   return buildParamDecorator("query", objectKey);
}
