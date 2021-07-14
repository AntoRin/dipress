import { Application } from "express";

export interface ApplicationOptions {
   appHandler?: Application;
   port?: number;
   verbose?: "no" | "minimal" | "detailed";
   controllers: Function[];
}
