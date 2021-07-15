import "reflect-metadata";

/**
 * * Use a method as a factory - the method will be executed during app initialization and its return value, if valid, will be used for subsequent processes
 */
export function Factory(target: Object, key: string, _: PropertyDescriptor) {
   Reflect.defineMetadata("isFactory", true, target, key);
}
