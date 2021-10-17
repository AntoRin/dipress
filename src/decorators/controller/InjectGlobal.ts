import { ServerGlobalsContainer } from "../../DI/ServerGlobalsContainer";

/**
 * @category Controller
 * @decorator InjectGlobal
 * * Injects the value of a Global Varaible previously initialized by making use of the return value of method decorated with the OnServerInit decorator.
 */
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
