import { NextFunction, Request, Response } from "express";
import { Application } from "./decorators/Application";
import { GET } from "./decorators/ControllerMethods";
import { PostHandlers } from "./decorators/PostHandler";
import { PreHandlers } from "./decorators/PreHandlers";
import { RestController } from "./decorators/RestController";
import { startupComponent } from "./decorators/StartupComponent";
import { UseMiddlewares } from "./decorators/UseMiddlewares";

function middleware(_: Request, __: Response, next: NextFunction) {
   console.log("middleware hit");
   return next();
}

function preHandler(_: Request, __: Response, next: NextFunction) {
   console.log("preHandler hit!!!");
   return next();
}

function postHandler(_: Request, __: Response, next: NextFunction) {
   console.log("postHandler hit!!!");
   return next();
}

@Application
@UseMiddlewares([middleware])
@RestController("/api")
export class TestDecorators {
   controllers(): any {
      return [TestDecorators];
   }

   @PreHandlers([preHandler])
   @GET("/home")
   method1(_: Request, res: Response) {
      res.send("home page");
   }

   @GET("/about")
   @PreHandlers([preHandler])
   @PostHandlers([postHandler])
   method2(_: Request, res: Response, next: NextFunction) {
      res.send("about page");
      return next();
   }

   @startupComponent
   method3() {
      console.log("DB connection, perhaps...");
   }
}
