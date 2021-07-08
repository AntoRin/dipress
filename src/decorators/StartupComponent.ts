import "reflect-metadata";

export function StartupComponent(
   target: Object,
   key: string,
   _: PropertyDescriptor
) {
   Reflect.defineMetadata("startupComponent", true, target, key);
}
