import { Request } from "express";
import { verifyAuthToken } from "../config/jwt";
import { AuthTokenPayloadDto } from "../dtos/auth.dto";
import { AuthService } from "../services/auth.service";
import { RoleEnum } from "../common/role";
import { iocContainer } from "../ioc";

export interface IGetUserAuthInfoRequest extends Request {
  userGuid: string;
  role: RoleEnum;
}

export const expressAuthentication = async (
  request: IGetUserAuthInfoRequest,
  securityName: string,
  scopes?: string[],
  response?: any
): Promise<any> => {
  let authService: AuthService = iocContainer.get(AuthService);
  const token =
    request.body.token ||
    request.query.token ||
    request.headers["authorization"];
  try {
    if (securityName === "jwt") {  
      const userData: AuthTokenPayloadDto = verifyAuthToken(token, scopes);
      await authService.checkUserStatus(userData.userGUID);
      request.userGuid = userData.userGUID;
      request.role = userData.role;
      return Promise.resolve({});
    }
    if (securityName === "newUser") {
      const userData: AuthTokenPayloadDto = verifyAuthToken(token, scopes);
      request.userGuid = userData.userGUID;
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
