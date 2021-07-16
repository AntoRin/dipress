import { HandlerCtxField } from "../types";

export interface ArgEntity {
   argModel: { type: HandlerCtxField; key?: string }[];
   index: number;
}
