import { buildMethodDecorator } from "../factories/buildMethodDecorator";

/**
 *
 * @param route: string
 * * Use the decorated method as a handler for GET requests to the route.
 */
export function GET(route: string) {
   return buildMethodDecorator("get", route);
}

/**
 *
 * @param route: string
 * * Use the decorated method as a handler for POST requests to the route.
 */
export function POST(route: string) {
   return buildMethodDecorator("post", route);
}

/**
 *
 * @param route: string
 * * Use the decorated method as a handler for PUT requests to the route.
 */
export function PUT(route: string) {
   return buildMethodDecorator("put", route);
}

/**
 *
 * @param route: string
 * * Use the decorated method as a handler for DELETE requests to the route.
 */
export function DELETE(route: string) {
   return buildMethodDecorator("delete", route);
}
