import "reflect-metadata";

export function ErrorHandler(
   target: Object,
   key: string,
   _: PropertyDescriptor
) {
   Reflect.defineMetadata("error-handler", true, target, key);
}
