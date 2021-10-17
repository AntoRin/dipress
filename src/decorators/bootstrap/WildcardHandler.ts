/**
 * @category Bootstrap
 * @decorator WildcardHandler
 * * Decorator for initializing a catch-all request handler.
 */
export function WildcardHandler(target: Object, key: string, _: PropertyDescriptor) {
   Reflect.defineMetadata("application-catch-all", true, target, key);
}
