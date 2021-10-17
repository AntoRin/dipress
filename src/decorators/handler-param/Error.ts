import { buildParamDecorator } from "./factories/buildParamDecorator";

/**
 * @category Parameters
 * @decorator Error
 * * Calls the handler with an error object
 */
export function Err(objectKey?: string) {
   return buildParamDecorator("error", objectKey);
}
