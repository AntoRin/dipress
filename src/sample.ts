import { Application, NextFunction, Request, Response } from "express";
import { ApplicationServer } from "./core/ApplicationServer";
import { GET, POST } from "./core/ControllerMethods";
import { PostRouteHandlers } from "./core/PostRouteHandlers";
import { PreRouteHandlers } from "./core/PreRouteHandlers";
import { RestController } from "./core/RestController";
import { OnServerInit } from "./core/OnServerInit";
import { UseMiddlewares } from "./core/UseMiddlewares";
import { Factory } from "./core/Factory";
import { Imports } from "./core/Imports";
import { OnResponseEnd } from "./core/OnResponseEnd";
import { ErrorHandler } from "./core/ErrorHandler";
import { OnServerActive } from "./core/OnServerActive";

function midMan(_: Request, __: Response, next: NextFunction) {
   console.log("this is the man in the middle");
   return next();
}

function secondMidMan(_: Request, __: Response, next: NextFunction) {
   console.log("second mid man");
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

@UseMiddlewares([secondMidMan])
@RestController("/")
class MoreEndpoints {
   @GET("/v2")
   index(_: Request, res: Response) {
      res.send("Index path");
   }
}

@ApplicationServer(null, 5000, true)
@UseMiddlewares(midMan)
@RestController("/api")
export class TestDecorators {
   @Imports
   controllers(): any {
      return [MoreEndpoints, TestDecorators];
   }

   @PreRouteHandlers(preHandler)
   @GET("/home")
   method1(_: Request, __: Response) {
      throw new Error("Error handler where you at");
      // return res.send("home page");
   }

   @GET("/about")
   @PreRouteHandlers(preHandler)
   @PostRouteHandlers(postHandler)
   method2(_: Request, res: Response, next: NextFunction) {
      res.send("about page");
      return next();
   }

   @OnServerInit
   async method3(app: Application) {
      console.log("DB connection, perhaps...");
      await new Promise((resolve, _) => setTimeout(() => resolve("yes..."), 500));
      app.get("/secret", (_: Request, res: Response) => res.send("Secret"));
      app.get("/another-secret", (_: Request, res: Response) => res.send("Secret"));
   }

   @OnServerActive
   serverHealthCheck() {
      console.log("server started");
   }

   @PreRouteHandlers(preHandler)
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

   @ErrorHandler
   errorHandler(error: any, _: Request, res: Response, __: NextFunction) {
      res.json({ status: "error", error: error.message });
   }

   @OnResponseEnd
   catchAll(_: Request, res: Response) {
      res.send("Not found");
   }
}
