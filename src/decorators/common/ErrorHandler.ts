/**
 * @category Common
 * @decorator ErrorHandler
 * * Initialize an ErrorRequestHandler for a controller.
 * * Can be used once for a controller.
 */
export function ErrorHandler(target: Object, key: string, _: PropertyDescriptor) {
   Reflect.defineMetadata("error-handler", true, target, key);
}
