import { Request, Response, NextFunction } from "express";
import { ArgEntity } from "../interfaces/ArgEntity";
import { validateDto } from "../decorators/validation/helpers/validateDto";

class ResponseContext {
   private static _Instance: ResponseContext | null = null;

   private constructor() {}

   public static get Instance(): ResponseContext {
      if (!ResponseContext._Instance) ResponseContext._Instance = new ResponseContext();

      return ResponseContext._Instance;
   }

   public createResponseHandler(propName: string, controllerInstance: any) {
      const getArgs = this.addRequiredHandlerArguments.bind(this);
      const handleResponse = this.handleResponse.bind(this);

      return function (req: Request, res: Response, next: NextFunction) {
         try {
            let methodArguments: any[] = [];

            const argEntity: ArgEntity | undefined = Reflect.getMetadata("method:param", controllerInstance, propName);

            if (argEntity) {
               const params: ArgEntity["argModel"] = argEntity.argModel;

               const paramDataTypes: any[] = Reflect.getMetadata("design:paramtypes", controllerInstance, propName);

               methodArguments = [...methodArguments, ...getArgs(params, paramDataTypes, req, res, next)];
            }

            let methodResult: any;

            methodResult = controllerInstance[propName].apply(controllerInstance, methodArguments);

            if (methodResult instanceof Promise) {
               methodResult
                  .then((promiseResult: any) => {
                     handleResponse(res, promiseResult);
                  })
                  .catch((error: any) => {
                     return next(error);
                  });
            } else {
               handleResponse(res, methodResult);
            }
         } catch (error) {
            return next(error);
         }
      };
   }

   public createErrorResponseHandler(propName: string, controllerInstance: any) {
      const getArgs = this.addRequiredHandlerArguments.bind(this);
      const handleResponse = this.handleResponse.bind(this);

      return function (error: any, req: Request, res: Response, next: NextFunction) {
         try {
            let methodArguments: any[] = [];

            const argEntity: ArgEntity | undefined = Reflect.getMetadata("method:param", controllerInstance, propName);

            if (argEntity) {
               const params: ArgEntity["argModel"] = argEntity.argModel;

               const paramDataTypes: any[] = Reflect.getMetadata("design:paramtypes", controllerInstance, propName);

               methodArguments = [...methodArguments, ...getArgs(params, paramDataTypes, req, res, next, error)];
            }

            let methodResult: any;

            methodResult = controllerInstance[propName].apply(controllerInstance, methodArguments);

            if (methodResult instanceof Promise) {
               methodResult
                  .then((promiseResult: any) => {
                     handleResponse(res, promiseResult);
                  })
                  .catch((error: any) => {
                     return next(error);
                  });
            } else {
               handleResponse(res, methodResult);
            }
         } catch (error) {
            return next(error);
         }
      };
   }

   private handleResponse(res: Response, methodResult: any): void {
      if (!res.headersSent) {
         switch (typeof methodResult) {
            case "string":
               res.send(methodResult);
               return;
            case "object":
               res.json(methodResult);
               return;
            case "bigint":
            case "boolean":
            case "number":
               res.send(methodResult.toString());
               return;
            case "undefined":
               break;
            default:
               res.end();
               return;
         }
      }
   }

   private addRequiredHandlerArguments(
      params: any[],
      paramDataTypes: any[],
      req: Request,
      res: Response,
      next: NextFunction,
      error?: any
   ): any[] {
      const args: any[] = [];
      for (let index = 0; index < params.length; index++) {
         const param = params[index];
         let paramValidationSuccess: boolean = true;

         switch (param.type) {
            case "context":
               if (error) args.push({ error, req, res, next });
               else args.push({ req, res, next });
               break;
            case "error":
               args.push(error);
               break;
            case "req":
               args.push(req);
               break;
            case "res":
               args.push(res);
               break;
            case "next":
               args.push(next);
               break;
            case "body":
               paramValidationSuccess = validateDto(req.body, paramDataTypes[index]);
               args.push(param.key ? req.body[param.key] : req.body);
               break;
            case "param":
               args.push(param.key ? req.params[param.key] : req.params);
               break;
            case "query":
               args.push(param.key ? req.query[param.key] : req.query);
               break;
         }

         if (!paramValidationSuccess) throw new Error("Invalid DTO");
      }

      return args;
   }
}

export const responseContext: ResponseContext = ResponseContext.Instance;
