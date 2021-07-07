import "reflect-metadata";

export function Factory(target: any, key: string, _: PropertyDescriptor) {
   Reflect.defineMetadata("isFactory", true, target, key);
}
