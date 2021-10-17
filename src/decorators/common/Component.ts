import { ObjectConstructor } from "../../types";
import { container } from "../../DI/Container";
/**
 * @category Common
 * @decorator Component
 * * Initializes a class as an injectable, hence allowing injection of its object as a dependency
 */
export function Component() {
   return function (constructor: ObjectConstructor<any>): void {
      container.resolveInstance(constructor);
   };
}
