import { ErrorRequestHandler, RequestHandler } from "express";
import { ObjectConstructor } from "../types";

export interface ServerConfig {
   controllers?: ObjectConstructor<any>[];
   errorHandler?: ErrorRequestHandler | ErrorRequestHandler[];
   catchAll?: RequestHandler | Array<RequestHandler>;
   afterStartupComponent?: Function;
}
