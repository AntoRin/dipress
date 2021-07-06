import { Application } from "express";

export class PathMap {
   private static _pathMapInstance: PathMap | null = null;
   private _pathList: Array<any> = [];

   private constructor() {
      this.printRouteMap = this.printRouteMap.bind(this);
      this.split = this.split.bind(this);
   }

   public static get Instance(): PathMap {
      if (!this._pathMapInstance) this._pathMapInstance = new PathMap();

      return this._pathMapInstance;
   }

   public displayPathMap(app: Application) {
      app._router.stack.forEach(this.printRouteMap.bind(null, []));
      console.table(this._pathList);
      this._pathList.length = 0;
   }

   public printRouteMap(path: any, layer: any) {
      if (layer.route) {
         layer.route.stack.forEach(
            this.printRouteMap.bind(
               null,
               path.concat(this.split(layer.route.path))
            )
         );
      } else if (layer.name === "router" && layer.handle.stack) {
         layer.handle.stack.forEach(
            this.printRouteMap.bind(null, path.concat(this.split(layer.regexp)))
         );
      } else if (layer.method) {
         return this._pathList.push({
            route:
               "/" +
               path.concat(this.split(layer.regexp)).filter(Boolean).join("/"),
            handler: layer.name,
            method: layer.method.toUpperCase(),
         });
      }
   }

   public split(thing: any) {
      if (typeof thing === "string") {
         return thing.split("/");
      } else if (thing.fast_slash) {
         return "";
      } else {
         let match = thing
            .toString()
            .replace("\\/?", "")
            .replace("(?=\\/|$)", "$")
            .match(
               /^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//
            );
         return match
            ? match[1].replace(/\\(.)/g, "$1").split("/")
            : "<complex:" + thing.toString() + ">";
      }
   }
}

export const pathMap: PathMap = PathMap.Instance;

//Credits to Douglas Wilson, member of express.js, for the route-search code
//https://github.com/dougwilson?tab=repositories
