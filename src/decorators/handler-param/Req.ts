import { buildParamDecorator } from "./factories/buildParamDecorator";

/**
 * @category Parameters
 * @decorator Req
 * * Calls the handler with the request object
 */
export function Req(objectKey?: string) {
   return buildParamDecorator("req", objectKey);
}
