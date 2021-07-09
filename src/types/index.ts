import { RequestHandler } from "express";

export interface RouteData {
   endPoint: string;
   method: string;
   preRouteHandlers?: Array<RequestHandler>;
   postRouteHandlers?: Array<RequestHandler>;
}

export interface ServerConfig {
   controllers?: Array<Function>;
   errorHandler?: RequestHandler | Array<RequestHandler>;
   catchAll?: RequestHandler | Array<RequestHandler>;
   afterStartupComponent?: Function;
}
