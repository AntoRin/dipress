export type ObjectConstructor<T> = new (...args: any[]) => T;

export type HandlerCtxField = "context" | "body" | "param" | "query";
