import { buildParamDecorator } from "./factories/buildParamDecorator";

/**
 * @category Parameters
 * @decorator Res
 * * Calls the handler with the response object
 */
export function Res(objectKey?: string) {
   return buildParamDecorator("res", objectKey);
}
