import "reflect-metadata";

export function OnServerInit(target: Object, key: string, _: PropertyDescriptor) {
   Reflect.defineMetadata("startup-component", true, target, key);
}
