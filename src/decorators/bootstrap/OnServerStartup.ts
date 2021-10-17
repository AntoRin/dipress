/**
 * @category Bootstrap
 * @decorator OnServerStartup
 * * Method decorated with this is called after server is up and running.
 * * The method is called with a server object parameter.
 * * Can be used only on one method.
 */
export function OnServerStartup(target: Object, key: string, descriptor: PropertyDescriptor) {
   Reflect.defineMetadata("after-startup-component", true, target, key);
}
