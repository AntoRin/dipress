export type ObjectConstructor<T> = new (...args: any[]) => T;

export type HandlerCtxField = "context" | "req" | "res" | "next" | "body" | "param" | "query";
