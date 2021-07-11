import { Application, NextFunction, Request, Response } from "express";
import {
   ApplicationServer,
   GET,
   POST,
   RestController,
   OnServerInit,
   OnServerStartup,
   Factory,
   Imports,
   WildcardHandler,
   ErrorHandler,
   OnRequestEntry,
   OnRequestExit,
} from "./core/decorators";

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

function postHandler(_: Request, __: Response, next: NextFunction) {
   console.log("postHandler hit!!!");
   next();
}

function factory(_: Request, ___: Response, __: NextFunction) {
   console.log("hit");

   // res.send("Factory route");
}

@RestController("/")
@OnRequestEntry(secondMidMan)
class MoreEndpoints {
   @GET("/v2")
   index(_: Request, res: Response, __: NextFunction) {
      res.send("Index path");
      // next();
   }
}

@ApplicationServer(null, 5000, true)
@OnRequestEntry(midMan)
@OnRequestExit(factory)
@RestController("/api")
export class TestDecorators {
   @Imports
   controllers(): any {
      return [MoreEndpoints, TestDecorators];
   }

   @OnRequestEntry(preHandler)
   @GET("/home")
   method1(_: Request, __: Response) {
      throw new Error("Error handler where you at");
      // return res.send("home page");
   }

   @GET("/about")
   @OnRequestEntry(preHandler)
   @OnRequestExit(postHandler)
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

   @OnServerStartup
   serverHealthCheck() {
      console.log("server started");
   }

   @OnRequestEntry(preHandler)
   @GET("/factory")
   @Factory
   method4() {
      return [factory];
   }

   @OnRequestExit([postHandler])
   @POST("/check")
   method5(_: Request, res: Response) {
      console.log("post method");
      res.json({ status: "ok" });
   }

   @ErrorHandler
   errorHandler(error: any, _: Request, res: Response, __: NextFunction) {
      res.json({ status: "error", error: error.message });
   }

   @WildcardHandler
   catchAll(_: Request, res: Response) {
      res.send("Not found");
   }
}
