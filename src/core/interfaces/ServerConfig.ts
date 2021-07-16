import { RequestHandler } from "express";
import { constructor } from "../types";

export interface ServerConfig {
   controllers?: constructor<any>[];
   errorHandler?: RequestHandler | Array<RequestHandler>;
   catchAll?: RequestHandler | Array<RequestHandler>;
   afterStartupComponent?: Function;
}
