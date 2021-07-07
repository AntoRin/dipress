import { NextFunction, Request, Response } from "express";
import { ApplicationServer } from "./decorators/ApplicationServer";
import { GET, POST } from "./decorators/ControllerMethods";
import { PostRouteHandlers } from "./decorators/PostRouteHandlers";
import { PreRouteHandlers } from "./decorators/PreRouteHandlers";
import { RestController } from "./decorators/RestController";
import { StartupComponent } from "./decorators/StartupComponent";
import { UseMiddlewares } from "./decorators/UseMiddlewares";
import { Factory } from "./decorators/Factory";

function midMan(_: Request, __: Response, next: NextFunction) {
   console.log("this is the man in the middle");
   return next();
}

function preHandler(_: Request, __: Response, next: NextFunction) {
   console.log("preHandler hit!!!");
   return next();
}

function postHandler(_: Request, __: Response) {
   console.log("postHandler hit!!!");
}

function factory(_: Request, res: Response, __: NextFunction) {
   console.log("hit");

   res.send("Factory route");
}

@ApplicationServer()
@RestController("/api")
@UseMiddlewares([midMan])
export class TestDecorators {
   controllers(): any {
      return [TestDecorators];
   }

   @PreRouteHandlers([preHandler])
   @GET("/home")
   method1(_: Request, res: Response) {
      return res.send("home page");
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
         setTimeout(() => resolve("yes..."), 500)
      );
   }

   @PreRouteHandlers([preHandler])
   @GET("/factory")
   @Factory
   method4() {
      return [factory];
   }

   @PostRouteHandlers([postHandler])
   @POST("/check")
   method5(_: Request, res: Response) {
      console.log("post method");
      res.json({ status: "ok" });
   }

   catchAll(_: Request, res: Response) {
      res.send("Not found");
   }
}
