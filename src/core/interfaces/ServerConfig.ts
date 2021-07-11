import { RequestHandler } from "express";

export interface ServerConfig {
   controllers?: Array<Function>;
   errorHandler?: RequestHandler | Array<RequestHandler>;
   catchAll?: RequestHandler | Array<RequestHandler>;
   afterStartupComponent?: Function;
}
