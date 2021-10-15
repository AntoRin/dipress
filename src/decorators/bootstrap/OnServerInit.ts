export function OnServerInit(globalValKeyName: string = Date.now().toString()) {
   return function(target: Object, key: string, _: PropertyDescriptor) {
      Reflect.defineMetadata("startup-component", globalValKeyName, target, key);
   }
}
