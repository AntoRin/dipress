import "reflect-metadata";

export function Imports(target: Object, key: string, _: PropertyDescriptor) {
   Reflect.defineMetadata("controller-imports", true, target, key);
}
