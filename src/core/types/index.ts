export type constructor<T> = new (...args: any[]) => T;

export type HandlerCtxField = "context" | "body" | "param" | "query";
