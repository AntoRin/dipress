import { RequestHandler } from "express";

export interface RouteData {
   endPoint: string;
   method: string;
   preRouteHandlers?: RequestHandler[];
   postRouteHandlers?: RequestHandler[];
}
