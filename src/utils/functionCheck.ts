export function isFunctionTypeOnly(param: Function | Array<Function>): boolean {
   if (Array.isArray(param)) {
      for (const fn of param) {
         if (typeof fn !== "function") return false;
      }
      return true;
   } else {
      return typeof param === "function" ? true : false;
   }
}
