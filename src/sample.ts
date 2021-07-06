import { NextFunction, Request, Response } from "express";
import { Server } from "./decorators/Server";
import { GET } from "./decorators/ControllerMethods";
import { PostRouteHandlers } from "./decorators/PostRouteHandlers";
import { PreRouteHandlers } from "./decorators/PreRouteHandlers";
import { RestController } from "./decorators/RestController";
import { StartupComponent } from "./decorators/StartupComponent";
import { UseMiddlewares } from "./decorators/UseMiddlewares";
import { Factory } from "./decorators/Factory";

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

function factory(_: Request, res: Response, __: NextFunction) {
   console.log("hit");

   res.send("Factory route");
}

@Server()
@UseMiddlewares([middleware])
@RestController("/api")
export class TestDecorators {
   controllers(): any {
      return [TestDecorators];
   }

   @PreRouteHandlers([preHandler])
   @GET("/home")
   method1(_: Request, res: Response) {
      res.send("home page");
   }

   @GET("/about")
   @PreRouteHandlers([preHandler])
   @PostRouteHandlers([postHandler])
   method2(_: Request, res: Response, next: NextFunction) {
      res.send("about page");
      return next();
   }

   @StartupComponent
   async method3() {
      console.log("DB connection, perhaps...");
      await new Promise((resolve, _) =>
         setTimeout(() => resolve("yes..."), 5000)
      );
   }

   @PreRouteHandlers([preHandler])
   @GET("/factory")
   @Factory
   method4() {
      return [factory];
   }
}
