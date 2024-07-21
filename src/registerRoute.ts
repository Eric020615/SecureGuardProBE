import express from "express";
import { ValidateError } from "tsoa";
import { log } from "./helper/log";
import { RegisterRoutes } from "./routes";
import { HttpStatusCode } from "./common/http-status-code";
import { OperationError } from "./common/operation-error";
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJson from './swagger.json';

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
  app
    .use(cors(corsOptions))
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use(["/openapi", "/docs", "/swagger"], swaggerUi.serve, swaggerUi.setup(swaggerJson))
    .use((_req, res, next) => {
      
      res.header(
        "Access-Control-Allow-Headers",
        `Origin, X-Requested-With, Content-Type, Accept, Authorization`
      );
      next();
    });

  RegisterRoutes(app);

  const getErrorBody = (err: unknown) => {
    if (err instanceof ValidateError) {
      return {
        message: err.message,
        status: HttpStatusCode.BAD_REQUEST,
        fields: err.fields,
        name: err.name,
      };
    } else if (err instanceof OperationError) {
      return {
        message: err.message,
        status: err.status,
      };
    } else {
      console.log(err)
      return {
        message: "UNKNOWN_ERROR",
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      };
    }
  };

  app.use(
    (
      err: IError,
      _req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const body = getErrorBody(err);
      res.status(body.status).json(body);
      next();
    }
  );
};