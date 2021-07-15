/**
 *
 * * Initializes a class as an injectable, hence allowing injection of its object as a dependency
 */
export function Component() {
   return function (constructor: Function): void {};
}
