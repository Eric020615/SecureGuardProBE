import { LoginDto, RegisterUserDto } from "../dtos/auth.dto";
import {
  Controller,
  Route,
  Post,
  Tags,
  OperationId,
  Response,
  SuccessResponse,
  Body,
  Security,
  Get,
  Request,
} from "tsoa";
import { IResponse } from "../dtos/response.dto";
import { loginService, registerService } from "../services/auth.service";
import { HttpStatusCode } from "../common/http-status-code";
import { OperationError } from "../common/operation-error";
import { IGetUserAuthInfoRequest } from "../middleware/security.middleware";

@Route("user")
export class UserController extends Controller {
  @Tags("User")
  @OperationId("createUser")
  @Response<IResponse<any>>("400", "Bad Request")
  @SuccessResponse("200", "OK")
  @Post("/create")
  @Security("jwt", ["RES", "SA"])
  public async createUser(
    @Request() request: IGetUserAuthInfoRequest,
    @Body() registerUserDto: RegisterUserDto
  ): Promise<IResponse<any>> {
    try {
      await registerService(registerUserDto);
      const response = {
        message: "User Created successfully",
        status: "200",
        data: null,
      };
      return response;
    } catch (err: any) {
      this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
      const response = {
        message: err.message ? err.message : "",
        status: "500",
        data: null,
      };
      console.log(response);
      return response;
    }
  }
}
