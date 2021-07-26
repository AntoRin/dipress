import { buildParamDecorator } from "./factories/buildParamDecorator";

export function Context() {
   return buildParamDecorator("context");
}
