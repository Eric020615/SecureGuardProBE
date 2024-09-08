import { Request } from "express";
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
  scopes?: string[],
  response?: any
): Promise<any> => {
  const token =
    request.body.token ||
    request.query.token ||
    request.headers["authorization"];
  try {
    if (securityName === "jwt") {  
      const userData: JwtPayloadDto = verifyToken(token, scopes);
      await checkUserStatus(userData.userGUID);
      request.userId = userData.userGUID;
      request.role = userData.role;
      return Promise.resolve({});
    }
    if (securityName === "newUser") {
      const userData: JwtPayloadDto = verifyToken(token, scopes);
      request.userId = userData.userGUID;
      request.role = userData.role;
      return Promise.resolve({});
    }
  } catch (error: any) {
    return response.status(402).json({
      message: error.message,
      status: 402,
      data: null
    });
  }
};
