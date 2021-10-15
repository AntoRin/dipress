import { EventEmitter } from "events";

export class PromiseHandler extends EventEmitter {
   private _promises: Array<Promise<any>> = [];
   private _resultKeys: string[] = [];
   private _resultsStore: any;

   constructor(customResultsStore: any) {
      super();
      this._resultsStore = customResultsStore || {};
   }

   public get promises() {
      return this._promises;
   }

   public addNewPromise(promise: Promise<any>, keyName: string) {
      this._promises.push(promise);
      this._resultKeys.push(keyName);
   }

   public async executePromises() {
      try {
         const promisesResult = await Promise.all(this._promises);
         this._mapPromiseResults(promisesResult);
         this._promises.length = 0;
         this.emit("success");
      } catch (error) {
         console.log(error);
         this.emit("failure", error);
      }
   }

   private _mapPromiseResults(resolvedPromisesArray: any[]) {
      for (let idx = 0; idx < resolvedPromisesArray.length; idx++) {
         this._resultsStore[this._resultKeys[idx]] = resolvedPromisesArray[idx];
      }
   }
}
