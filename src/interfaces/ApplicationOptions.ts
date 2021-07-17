import { Application } from "express";
import { ObjectConstructor } from "../types";

export interface ApplicationOptions {
   appHandler?: Application;
   port?: number;
   verbose?: "no" | "minimal" | "detailed";
   controllers: ObjectConstructor<any>[];
}
