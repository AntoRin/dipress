import { buildParamDecorator } from "./factories/buildParamDecorator";

export function Req(objectKey?: string) {
   return buildParamDecorator("req", objectKey);
}
