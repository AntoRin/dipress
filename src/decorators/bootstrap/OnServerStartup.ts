export function OnServerStartup(target: Object, key: string, _: PropertyDescriptor) {
   Reflect.defineMetadata("after-startup-component", true, target, key);
}
