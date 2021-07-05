export interface RouteData {
   endPoint: string;
   method: string;
   preHandlers?: Array<Function>;
   postHandlers?: Array<Function>;
}
