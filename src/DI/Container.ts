import { ObjectConstructor } from "../types";

class Container {
   private static _containerInstance: Container | null = null;
   private _availableInstances: any[] = [];

   public static get Instance(): Container {
      if (!Container._containerInstance) Container._containerInstance = new Container();

      return Container._containerInstance;
   }

   public getAvailableInstances() {
      return this._availableInstances;
   }

   public resolveInstance(Resource: ObjectConstructor<any>): any {
      const available = this._availableInstances.find(instance => instance.constructor.name === Resource.name);

      if (available) return available;

      const dependencies: any[] = Reflect.getMetadata("design:paramtypes", Resource) || [];

      const instances: any[] = [];

      for (const dependency of dependencies) {
         instances.push(this.resolveInstance(dependency));
      }

      const acquiredResource: any = new Resource(...instances);
      this._availableInstances.push(acquiredResource);
      return acquiredResource;
   }
}

export const container: Container = Container.Instance;
