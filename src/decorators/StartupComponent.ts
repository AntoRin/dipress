import "reflect-metadata";

export function startupComponent(
   target: any,
   key: string,
   _: PropertyDescriptor
) {
   Reflect.defineMetadata("startupComponent", true, target, key);
}
