/**
 * @category Bootstrap
 * @decorator OnServerInit
 * * Methods decorated with this are called before initializing the server
 */
export function OnServerInit(globalValKeyName: string = Date.now().toString()) {
   return function (target: Object, key: string, descriptor: PropertyDescriptor) {
      Reflect.defineMetadata("startup-component", globalValKeyName, target, key);
   };
}
