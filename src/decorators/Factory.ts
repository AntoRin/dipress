import "reflect-metadata";

export function Factory(target: Object, key: string, _: PropertyDescriptor) {
   Reflect.defineMetadata("isFactory", true, target, key);
}
