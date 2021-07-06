export interface RouteData {
   endPoint: string;
   method: string;
   preRouteHandlers?: Array<Function>;
   postRouteHandlers?: Array<Function>;
   isFactory?: boolean;
}
