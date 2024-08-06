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
  Query,
} from "tsoa";
import { IResponse } from "../dtos/index.dto"
import { HttpStatusCode } from "../common/http-status-code";
import { OperationError } from "../common/operation-error";
import { IGetUserAuthInfoRequest } from "../middleware/security.middleware";
import { createUserService, GetUserDetailsByIdService, GetUserListService } from "../services/user.service";
import { CreateResidentDto, GetUserDetailsByIdDto, GetUserDto } from "../dtos/user.dto";

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

  @Tags("User")
  @OperationId("getUserList")
  @Response<IResponse<GetUserDto[]>>(HttpStatusCode.BAD_REQUEST, "Bad Request")
  @SuccessResponse(HttpStatusCode.OK, "OK")
  @Get("/user-list")
  @Security("jwt", ["SA"])
  public async getUserList(
    @Query() isActive: boolean
  ): Promise<IResponse<any>> {
    try {
      const data = await GetUserListService(isActive)
      const response = {
        message: "User list retrieve successfully",
        status: "200",
        data: data,
      };
      return response;
    } catch (err) {
      this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
      const response = {
        message: "Failed to retrieve user list",
        status: "500",
        data: null,
      };
      return response;
    }
  }

  @Tags("User")
  @OperationId("getUserDetailsById")
  @Response<IResponse<GetUserDetailsByIdDto>>(HttpStatusCode.BAD_REQUEST, "Bad Request")
  @SuccessResponse(HttpStatusCode.OK, "OK")
  @Get("/details")
  @Security("jwt", ["SA"])
  public async getUserDetailsById(
    @Query() userId: string
  ): Promise<IResponse<any>> {
    try {
      const data = await GetUserDetailsByIdService(userId)
      const response = {
        message: "User details retrieve successfully",
        status: "200",
        data: data,
      };
      return response;
    } catch (err) {
      this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
      const response = {
        message: "Failed to retrieve user details",
        status: "500",
        data: null,
      };
      return response;
    }
  }
}
