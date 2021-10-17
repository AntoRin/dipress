import { buildParamDecorator } from "./factories/buildParamDecorator";

/**
 * @category Parameters
 * @decorator Body
 * * Calls the handler with req.body
 */
export function Body(objectKey?: string) {
   return buildParamDecorator("body", objectKey);
}
