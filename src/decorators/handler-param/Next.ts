import { buildParamDecorator } from "./factories/buildParamDecorator";

/**
 * @category Parameters
 * @decorator Next
 * * Calls the handler with the NextFunction
 */
export function Next(objectKey?: string) {
   return buildParamDecorator("next", objectKey);
}
