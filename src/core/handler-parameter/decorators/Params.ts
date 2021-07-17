import { buildParamDecorator } from "../helpers/buildParamDecorator";

export function Params(objectKey?: string) {
   return buildParamDecorator("param", objectKey);
}
