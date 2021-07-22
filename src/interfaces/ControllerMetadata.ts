import { RequestHandler } from "express";

export interface ControllerMetadata {
   basePath: string;
   entryHandlers?: RequestHandler[];
   exitHandlers?: RequestHandler[];
   errorHandlerName?: RequestHandler;
}
