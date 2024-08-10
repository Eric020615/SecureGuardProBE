import { NextFunction, Request } from "express";
import { verifyToken } from "../config/jwt";
import { JwtPayloadDto } from "../dtos/auth.dto";
import { checkUserStatus } from "../services/auth.service";
import { RoleEnum } from "../common/role";

export interface IGetUserAuthInfoRequest extends Request {
  userId: string;
  role: RoleEnum;
}

export const expressAuthentication = async (
  request: IGetUserAuthInfoRequest,
  securityName: string,
  scopes?: string[]
): Promise<any> => {
  const token =
    request.body.token ||
    request.query.token ||
    request.headers["authorization"];

  if (securityName === "jwt") {
    try {
      const userData: JwtPayloadDto = verifyToken(token, scopes);
      await checkUserStatus(userData.userGUID);
      request.userId = userData.userGUID;
      request.role = userData.role;
      return Promise.resolve({});
    } catch (error) {
      return Promise.reject(error);
    }
  }
  if (securityName === "newUser") {
    try {
      const userData: JwtPayloadDto = verifyToken(token, scopes);
      await checkUserStatus(userData.userGUID);
      request.userId = userData.userGUID;
      request.role = userData.role;
      return Promise.resolve({});
    } catch (error) {
      return Promise.reject(error);
    }
  }
  return Promise.reject({});
};
