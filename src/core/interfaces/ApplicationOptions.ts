import { Application } from "express";

export interface ApplicationOptions {
   appHandler?: Application;
   port?: number;
   verbose?: boolean;
   controllers: Function[];
   services?: Function[];
}
