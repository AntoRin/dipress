export function WildcardHandler(target: Object, key: string, _: PropertyDescriptor) {
   Reflect.defineMetadata("application-catch-all", true, target, key);
}
