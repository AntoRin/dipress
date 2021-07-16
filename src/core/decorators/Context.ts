import { buildParamDecorator } from "../utils/buildParamDecorator";

export function Context() {
   return buildParamDecorator("context");
}
