import "reflect-metadata";

export function OnServerActive(target: Object, key: string, _: PropertyDescriptor) {
   Reflect.defineMetadata("after-startup-component", true, target, key);
}
