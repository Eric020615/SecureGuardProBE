import express, { Response } from "express";
import { ValidateError } from "tsoa";
import { log } from "./helper/log";
import { RegisterRoutes } from "./routes";
import { HttpStatusCode } from "./common/http-status-code";
import { OperationError } from "./common/operation-error";
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJson from './swagger.json';
import { IResponse } from "./dtos/index.dto";

interface IError {
  status?: number;
  fields?: string[];
  message?: string;
  name?: string;
}

const corsOptions = {
  origin: [
      'http://localhost:8081',
      'http://localhost:4000'
  ],
  optionsSuccessStatus: 200,
};

export const registerRoutes = (app: express.Express) => {
  // const getErrorBody = (err: unknown) => {
    
  //   if (err instanceof ValidateError) {
  //     return {
  //       message: err.message,
  //       status: HttpStatusCode.BAD_REQUEST,
  //       fields: err.fields,
  //       name: err.name,
  //     };
  //   } else if (err instanceof OperationError) {
  //     return {
  //       message: err.message,
  //       status: err.status,
  //     };
  //   } else {
  //     return {
  //       message: "UNKNOWN_ERROR",
  //       status: HttpStatusCode.INTERNAL_SERVER_ERROR,
  //     };
  //   }
  // };

  app
    .use(cors(corsOptions))
    .use(express.urlencoded({ extended: true, limit: '50mb' }))
    .use(express.json({limit: '50mb'}))
    .use(["/openapi", "/docs", "/swagger"], swaggerUi.serve, swaggerUi.setup(swaggerJson))
    .use((_req, res, next) => {
      res.header(
        "Access-Control-Allow-Headers",
        `Origin, X-Requested-With, Content-Type, Accept, Authorization`
      );
      next();
    })
    .use((
      err: IError,
      _req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) : Response | void => {
      if (err instanceof ValidateError) {
        console.warn(`Caught Validation Error for ${_req.path}:`, err.fields);
        return res.status(422).json({
          message: `Validation Failed, ${err?.fields}`,
          status: 500,
          data: null
        });
      }
      if (err instanceof Error) {
        return res.status(500).json({
          message: "Internal Server Error",
          status: 500,
          data: null
        });
      }
      next();
    });

  RegisterRoutes(app);
};