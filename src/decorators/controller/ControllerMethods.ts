import { buildMethodDecorator } from "./factories/buildMethodDecorator";

/**
 * @category Controller
 * @decorator GET
 * * Use the decorated method as a handler for GET requests to the route.
 */
export function GET(route: string) {
   return buildMethodDecorator("get", route);
}

/**
 * @category Controller
 * @decorator POST
 * * Use the decorated method as a handler for POST requests to the route.
 */
export function POST(route: string) {
   return buildMethodDecorator("post", route);
}

/**
 * @category Controller
 * @decorator PUT
 * * Use the decorated method as a handler for PUT requests to the route.
 */
export function PUT(route: string) {
   return buildMethodDecorator("put", route);
}

/**
 * @category Controller
 * @decorator DELETE
 * * Use the decorated method as a handler for DELETE requests to the route.
 */
export function DELETE(route: string) {
   return buildMethodDecorator("delete", route);
}

/**
 * @category Controller
 * @decorator ALL
 * * Use the decorated method as a handler for ALL requests to the route.
 */
export function ALL(route: string) {
   return buildMethodDecorator("all", route);
}
