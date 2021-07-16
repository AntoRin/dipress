import { buildParamDecorator } from "../utils/buildParamDecorator";

export function Params(objectKey?: string) {
   return buildParamDecorator("param", objectKey);
}
