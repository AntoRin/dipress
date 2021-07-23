import { RequestHandler } from "express";

export interface RouteData {
   endPoint: string;
   method: "get" | "post" | "put" | "delete" | "all" | "patch";
   preRouteHandlers?: RequestHandler[];
   postRouteHandlers?: RequestHandler[];
}
