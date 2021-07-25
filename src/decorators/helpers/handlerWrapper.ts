import { NextFunction, Request, RequestHandler, Response } from "express";
import { ArgEntity } from "../../interfaces/ArgEntity";
import { validateDto } from "../../utils/validateDto";

export function wrapHandler(propName: string, controllerInstance: any): RequestHandler {
   return function (req: Request, res: Response, next: NextFunction) {
      let methodArguments: any[] = [];

      const argEntity: ArgEntity | undefined = Reflect.getMetadata("method:param", controllerInstance, propName);

      if (argEntity) {
         const params: ArgEntity["argModel"] = argEntity.argModel;

         const paramDataTypes: any[] = Reflect.getMetadata("design:paramtypes", controllerInstance, propName);

         for (let index = 0; index < params.length; index++) {
            const param = params[index];
            let paramValidationSuccess: boolean = true;

            switch (param.type) {
               case "context":
                  methodArguments.push({
                     req,
                     res,
                     next,
                  });
                  break;
               case "req":
                  methodArguments.push(req);
                  break;
               case "res":
                  methodArguments.push(res);
                  break;
               case "next":
                  methodArguments.push(next);
                  break;
               case "body":
                  paramValidationSuccess = validateDto(req.body, paramDataTypes[index]);

                  methodArguments.push(param.key ? req.body[param.key] : req.body);
                  break;
               case "param":
                  methodArguments.push(param.key ? req.params[param.key] : req.params);
                  break;
               case "query":
                  methodArguments.push(param.key ? req.query[param.key] : req.query);
                  break;
            }

            if (!paramValidationSuccess) return res.status(400).json({ status: "error", error: "invalid dto" });
         }
      }

      let methodResult: any;

      try {
         methodResult = controllerInstance[propName].apply(controllerInstance, methodArguments);

         if (methodResult instanceof Promise) {
            methodResult
               .then((methodResult: any) => {
                  if (!res.headersSent)
                     switch (typeof methodResult) {
                        case "string":
                           return res.send(methodResult);
                        case "object":
                           return res.json(methodResult);
                        case "bigint":
                        case "boolean":
                        case "number":
                           return res.send(methodResult.toString());
                        case "undefined":
                           break;
                        default:
                           return res.end();
                     }
               })
               .catch((error: any) => {
                  return next(error);
               });
         } else {
            if (!res.headersSent)
               switch (typeof methodResult) {
                  case "string":
                     return res.send(methodResult);
                  case "object":
                     return res.json(methodResult);
                  case "bigint":
                  case "boolean":
                  case "number":
                     return res.send(methodResult.toString());
                  case "undefined":
                     break;
                  default:
                     return res.end();
               }
         }
      } catch (error) {
         return next(error);
      }
   };
}
