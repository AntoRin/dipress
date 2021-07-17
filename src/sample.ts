import { Component } from "./main/common/decorators/Component";
import express, { Application, NextFunction, Request, Response } from "express";
import { ErrorHandler, Factory } from "./main/common";
import {
   RestController,
   OnRequestEntry,
   GET,
   ApplicationServer,
   OnRequestExit,
   Context,
   Query,
   OnServerInit,
   OnServerStartup,
   POST,
   Params,
   Body,
   WildcardHandler,
} from ".";

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

@Component()
class ServiceDep {
   dep() {
      return "dependency of dependencies";
   }
}

@Component()
class Service {
   constructor(private _serviceDep: ServiceDep) {}
   serviceMethod(): string {
      return "service called" + this._serviceDep.dep();
   }
}

@Component()
class AnotherService {
   anotherServiceMethod(): string {
      return "anotherService called";
   }
}

@RestController("/")
@OnRequestEntry(secondMidMan)
class MoreEndpoints {
   public constructor(private _service: Service, private _anotherService: AnotherService) {}

   @GET("/v2")
   index() {
      return {
         status: "super okay",
         data: "no data for you",
      };
   }

   @GET("/private")
   sayHello(req: Request, res: Response) {
      // res.send(`${this._service.serviceMethod()} ${this._anotherService.anotherServiceMethod()}`);
      return this._service.serviceMethod() + " " + this._anotherService.anotherServiceMethod();
   }
}

@ApplicationServer({
   port: 5000,
   verbose: "minimal",
   controllers: [MoreEndpoints, TestDecorators],
})
@OnRequestEntry(midMan)
@OnRequestExit(factory)
@RestController("/api")
export class TestDecorators {
   @OnRequestEntry(preHandler)
   @GET("/home")
   method1(_: Request, __: Response) {
      throw new Error("Error handler where you at");
      // return res.send("home page");
   }

   @GET("/about")
   @OnRequestEntry(preHandler)
   @OnRequestExit(postHandler)
   method2(@Context() ctx: any, @Query("aboutwhat") q: string) {
      console.log(q);
      ctx.next();
      return ["ada"];
   }

   @OnServerInit
   async method3(app: Application) {
      console.log("DB connection, perhaps...");
      app.use(express.json());
      await new Promise((resolve, _) => setTimeout(() => resolve("yes...")));
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

   @POST("/data/:id")
   postCheck(@Query("q") query: any, @Params("id") params: any, @Body("body") reqBody: any) {
      console.log("body through reqbody", reqBody);
      console.log("params", params);
      console.log("query", query);

      return "done";
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
