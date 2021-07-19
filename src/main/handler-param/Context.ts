import { buildParamDecorator } from "./helpers/buildParamDecorator";

export function Context() {
   return buildParamDecorator("context");
}
