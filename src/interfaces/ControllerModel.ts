export interface EndPoint {
   path: string;
   handlerName: string;
   entryMiddleware: string | string[];
   exitMiddleware: string | string[];
   method: string;
}

export interface ControllerModel {
   controllerName: string;
   entryMiddleware: string[];
   exitMiddleware: string[];
   endPoints: EndPoint[];
}
