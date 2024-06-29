// import { NextFunction, Request, Response } from "express"
// import { verifyToken } from "../config/jwt"

// export const checkJWT = (req: Request, res: Response, next: NextFunction) => {
//     const authHeader = req.headers.authorization

//     if(!authHeader?.startsWith("Bearer ")){
//         return res.status(401).send({
//             message: "Authorization failed",
//             code: 401
//         }) 
//     }
//     const token = authHeader?.substring(7);
//     const payload = verifyToken(token ? token : "");
//     next()
// }

import * as express from "express";
import { verifyToken } from "../config/jwt";

export const expressAuthentication = (
  request: express.Request,
  securityName: string,
  scopes?: string[]
): Promise<any> => {
  if (securityName === "jwt") {
    const token =
      request.body.token ||
      request.query.token ||
      request.headers["authorization"];
    return new Promise((resolve, reject) => {
      verifyToken(token, scopes);
      resolve({})
    });
  }
  return Promise.reject({});
}