import { buildParamDecorator } from "../utils/buildParamDecorator";

export function Query(objectKey?: string) {
   return buildParamDecorator("query", objectKey);
}
