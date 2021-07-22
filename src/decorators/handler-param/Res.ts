import { buildParamDecorator } from "../factories/buildParamDecorator";

export function Res(objectKey?: string) {
   return buildParamDecorator("res", objectKey);
}
