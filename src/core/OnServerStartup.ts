import "reflect-metadata";

export function OnServerStartup(
   target: Object,
   key: string,
   _: PropertyDescriptor
) {
   Reflect.defineMetadata("startup-component", true, target, key);
}
