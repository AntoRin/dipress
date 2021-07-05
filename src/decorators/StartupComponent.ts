import "reflect-metadata";

export function StartupComponent(
   target: any,
   key: string,
   _: PropertyDescriptor
) {
   Reflect.defineMetadata("startupComponent", true, target, key);
}
