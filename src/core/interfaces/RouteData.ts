import { RequestHandler } from "express";

export interface RouteData {
   endPoint: string;
   method: string;
   preRouteHandlers?: Array<RequestHandler>;
   postRouteHandlers?: Array<RequestHandler>;
}
