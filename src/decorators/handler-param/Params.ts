import { buildParamDecorator } from "./factories/buildParamDecorator";

/**
 * @category Parameters
 * @decorator Params
 * * Calls the handler with req.params
 */
export function Params(objectKey?: string) {
   return buildParamDecorator("param", objectKey);
}
