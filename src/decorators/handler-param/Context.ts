import { buildParamDecorator } from "./factories/buildParamDecorator";

/**
 * @category Parameters
 * @decorator Context
 * * Calls the handler with the req, res, next
 */
export function Context() {
   return buildParamDecorator("context");
}
