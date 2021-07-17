import { constructor } from "../../core/types";
import { container } from "../DI/Container";
/**
 *
 * * Initializes a class as an injectable, hence allowing injection of its object as a dependency
 */
export function Component() {
   return function (constructor: constructor<any>): void {
      container.resolveInstance(constructor);
   };
}
