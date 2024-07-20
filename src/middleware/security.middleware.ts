import { Request } from "express";
import { verifyToken } from "../config/jwt";
import { JwtPayloadDto } from "../dtos/auth.dto";
import { UserRole } from "../models/user.model";
import { checkUserStatus } from "../services/auth.service";

export interface IGetUserAuthInfoRequest extends Request {
  userId: string;
  role: UserRole;
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
    return new Promise((resolve) => {
      const userData: JwtPayloadDto = verifyToken(token, scopes);
      checkUserStatus(userData.userGUID);
      request.userId = userData.userGUID;
      request.role = userData.role;
      resolve({});
    });
  }
  if (securityName === "newUser") {
    const token =
      request.body.token ||
      request.query.token ||
      request.headers["authorization"];
    return new Promise((resolve) => {
      const userData: JwtPayloadDto = verifyToken(token, scopes);
      request.userId = userData.userGUID;
      request.role = userData.role;
      resolve({});
    });
  }
  return Promise.reject({});
};
