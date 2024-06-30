import { Request } from "express";
import { verifyToken } from "../config/jwt";
import { JwtPayloadDto } from "../dtos/auth.dto";

export interface IGetUserAuthInfoRequest extends Request {
  userId: string;
}

export const expressAuthentication = (
  request: IGetUserAuthInfoRequest,
  securityName: string,
  scopes?: string[]
): Promise<any> => {
  if (securityName === "jwt") {
    const token =
      request.body.token ||
      request.query.token ||
      request.headers["authorization"];
    return new Promise((resolve, reject) => {
      const userData : JwtPayloadDto = verifyToken(token, scopes);
      request.userId = userData.userGUID;
      resolve({})
    });
  }
  return Promise.reject({});
}