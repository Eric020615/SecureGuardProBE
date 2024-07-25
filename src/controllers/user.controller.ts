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
import { HttpStatusCode } from "../common/http-status-code";
import { OperationError } from "../common/operation-error";
import { IGetUserAuthInfoRequest } from "../middleware/security.middleware";
import { createUserService } from "../services/user.service";
import { CreateResidentDto } from "../dtos/user.dto";

@Route("user")
export class UserController extends Controller {
  @Tags("User")
  @OperationId("createUser")
  @Response<IResponse<any>>("400", "Bad Request")
  @SuccessResponse("200", "OK")
  @Post("/create")
  @Security("newUser", ["RES", "SA"])
  public async createUser(
    @Request() request: IGetUserAuthInfoRequest,
    @Body() createUserDto: CreateResidentDto
  ): Promise<IResponse<any>> {
    try {
      if (!request.userId || !request.role) {
        throw new OperationError(
          "User not found",
          HttpStatusCode.INTERNAL_SERVER_ERROR
        );
      }
      await createUserService(createUserDto, request.userId, request.role);
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
      return response;
    }
  }
}
