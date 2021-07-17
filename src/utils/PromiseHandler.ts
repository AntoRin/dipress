import { EventEmitter } from "events";

export class PromiseHandler extends EventEmitter {
   private _promises: Array<Promise<any>> = [];

   constructor() {
      super();
   }

   public get promises() {
      return this._promises;
   }

   public addNewPromise(promise: Promise<any>) {
      this._promises.push(promise);
   }

   public async executePromises() {
      try {
         await Promise.all(this._promises);
         this._promises.length = 0;
         this.emit("success");
      } catch (error) {
         console.log(error);
         this.emit("failure", error);
      }
   }
}
