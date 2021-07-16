import { Application } from "express";
import { constructor } from "../types";

export interface ApplicationOptions {
   appHandler?: Application;
   port?: number;
   verbose?: "no" | "minimal" | "detailed";
   controllers: constructor<any>[];
}
