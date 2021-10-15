import { ServerGlobalsContainer } from "../../DI/ServerGlobalsContainer";

export function InjectGlobal(injectableKeyName: string) {
   return function (target: Object, key: string) {
      Object.defineProperty(target, key, {
         get: function () {
            return ServerGlobalsContainer.ServerGlobal[injectableKeyName];
         },
         set: function () {
            throw new Error("Server Globals cannot be modified");
         },
      });
   };
}
