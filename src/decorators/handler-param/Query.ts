import { buildParamDecorator } from "./factories/buildParamDecorator";

/**
 * @category Parameters
 * @decorator Query
 * * Calls the handler with req.query
 */
export function Query(objectKey?: string) {
   return buildParamDecorator("query", objectKey);
}
