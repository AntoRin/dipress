import express, { Application, NextFunction, Request, Response } from "express";
import {
   ApplicationServer,
   Body,
   Context,
   ErrorHandler,
   Factory,
   GET,
   UseBefore,
   UseAfter,
   OnServerInit,
   OnServerStartup,
   Params,
   POST,
   Query,
   Required,
   RestController,
   Strict,
   WildcardHandler,
   InjectGlobal,
} from ".";
import { Err } from "./decorators";
import { Component } from "./decorators/common/Component";
import { Req } from "./decorators/handler-param/Req";
import { Res } from "./decorators/handler-param/Res";
import { MinLength } from "./decorators/validation/MinLength";

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
@UseBefore(secondMidMan)
class MoreEndpoints {
   private readonly _check: string = "hello world";
   @InjectGlobal("LOL") LOL: string | undefined;
   @InjectGlobal("WDYM") wdym: string | undefined;

   public constructor(private _service: Service, private _anotherService: AnotherService) {}

   @GET("/v2")
   async index(@Res() res: Response, @Req() req: Request) {
      console.log(this.LOL);
      console.log(this.wdym);

      await new Promise((resolve, reject) => {
         setTimeout(() => {
            resolve("Hola");
         });
      });

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

   @ErrorHandler
   error(@Context() ctx: any, @Res() res: Response) {
      console.log("error provided by dec", ctx.error, this._check);
      res.json({
         status: "error",
         error: "error provided by dec",
      });
   }
}

class BodyDto {
   @Required()
   @Strict()
   @MinLength(5)
   name!: string;

   @Required()
   @Strict()
   id!: any[];

   method() {}
}

@ApplicationServer({
   port: 5000,
   verbose: "minimal",
   controllers: [MoreEndpoints, TestDecorators],
})
@UseBefore(midMan)
@UseAfter(factory)
@RestController("/api")
export class TestDecorators {
   @InjectGlobal("WDYM") haha: any;

   @UseBefore(preHandler)
   @GET("/home")
   method1(_: Request, __: Response) {
      console.log(this.haha);
      // throw new Error("Error handler where you at");
      // return res.send("home page");
   }

   @GET("/about")
   @UseBefore(preHandler)
   @UseAfter(postHandler)
   method2(@Context() ctx: any, @Query("aboutwhat") q: string) {
      console.log(q);
      return ["ada"];
   }

   @OnServerInit("LOL")
   async method3(app: Application) {
      console.log("DB connection, perhaps...");
      app.use(express.json());
      await new Promise((resolve, _) => setTimeout(() => resolve("yes..."), 0));
      app.get("/secret", (_: Request, res: Response) => res.send("Secret"));
      app.get("/another-secret", (_: Request, res: Response) => res.send("Secret"));

      return {
         message: "This could be an injected string. Pretty cool, ri8?",
      };
   }

   @OnServerInit("WDYM")
   async methodInject() {
      await new Promise((resolve, _) => setTimeout(() => resolve("yes..."), 0));
      return "This too";
   }

   @OnServerStartup
   serverHealthCheck() {
      console.log("server started");
   }

   @UseBefore(preHandler)
   @GET("/factory")
   @Factory
   method4() {
      return [factory];
   }

   @UseAfter([postHandler])
   @POST("/check")
   method5(_: Request, res: Response) {
      console.log("post method");
      res.json({ status: "ok" });
   }

   @POST("/data/:id")
   postCheck(@Query("q") query: any, @Body() reqBody: BodyDto, @Params("id") params: any) {
      console.log("body through reqbody", reqBody);
      console.log("params", params);
      console.log("query", query);

      return "done";
   }

   @ErrorHandler
   errorHandler(@Res() res: Response, @Err() error: any) {
      res.json({ status: "error", error: error.message });
   }

   @WildcardHandler
   catchAll() {
      return "Not found lol";
   }
}
