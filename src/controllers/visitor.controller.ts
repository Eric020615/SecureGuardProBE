import { IResponse } from "../dtos/index.dto";
import {
  Body,
  Controller,
  OperationId,
  Post,
  Get,
  Response,
  Route,
  SuccessResponse,
  Tags,
  Put,
  Delete,
  Security,
  Request,
  Query,
} from "tsoa";
import { HttpStatusCode } from "../common/http-status-code";
import { IGetUserAuthInfoRequest } from "../middleware/security.middleware";
import { OperationError } from "../common/operation-error";
import {
  CreateVisitorDto,
  GetVisitorDto,
  EditVisitorByIdDto,
} from "../dtos/visitor.dto";
import {
  createVisitorService,
  editVisitorByIdService,
  getAllVisitorService,
  getVisitorByResidentService,
  getVisitorDetailsByResidentService,
} from "../services/visitor.service";

@Route("visitor")
export class VisitorController extends Controller {
  @Tags("Visitor")
  @OperationId("createVisitor")
  @Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, "Bad Request")
  @SuccessResponse(HttpStatusCode.OK, "OK")
  @Post("/create")
  @Security("jwt", ["RES", "SA"])
  public async createVisitor(
    @Body() createVisitorDto: CreateVisitorDto,
    @Request() request: IGetUserAuthInfoRequest
  ): Promise<IResponse<any>> {
    try {
      if (!request.userId) {
        throw new OperationError(
          "User not found",
          HttpStatusCode.INTERNAL_SERVER_ERROR
        );
      }
      await createVisitorService(createVisitorDto, request.userId);
      this.setStatus(HttpStatusCode.OK);
      const response = {
        message: "Visitor created successfully",
        status: "200",
        data: null,
      };
      return response;
    } catch (err) {
      this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
      const response = {
        message: "Failed to create visitor",
        status: "500",
        data: err,
      };
      return response;
    }
  }

  @Tags("Visitor")
  @OperationId("getVisitorByResident")
  @Response<IResponse<GetVisitorDto[]>>(
    HttpStatusCode.BAD_REQUEST,
    "Bad Request"
  )
  @SuccessResponse(HttpStatusCode.OK, "OK")
  @Get("/")
  @Security("jwt", ["RES", "SA"])
  public async getVisitorByResident(
    @Request() request: IGetUserAuthInfoRequest,
    @Query() isPast: boolean
  ): Promise<IResponse<any>> {
    try {
      if (!request.userId) {
        throw new OperationError(
          "User not found",
          HttpStatusCode.INTERNAL_SERVER_ERROR
        );
      }
      const data = await getVisitorByResidentService(request.userId, isPast);
      const response = {
        message: "Visitors retrieve successfully",
        status: "200",
        data: data,
      };
      return response;
    } catch (err) {
      this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
      const response = {
        message: "Failed to retrieve visitors",
        status: "500",
        data: null,
      };
      return response;
    }
  }

  @Tags("Visitor")
  @OperationId("getVisitorDetailsByResident")
  @Response<IResponse<GetVisitorDto>>(HttpStatusCode.BAD_REQUEST, "Bad Request")
  @SuccessResponse(HttpStatusCode.OK, "OK")
  @Get("/details")
  @Security("jwt", ["RES"])
  public async getVisitorDetailsByResident(
    @Request() request: IGetUserAuthInfoRequest,
    @Query() visitorId: string
  ): Promise<IResponse<any>> {
    try {
      if (!request.userId) {
        throw new OperationError(
          "User not found",
          HttpStatusCode.INTERNAL_SERVER_ERROR
        );
      }
      const data = await getVisitorDetailsByResidentService(visitorId);
      const response = {
        message: "Visitors retrieve successfully",
        status: "200",
        data: data,
      };
      return response;
    } catch (err) {
      this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
      const response = {
        message: "Failed to retrieve visitors",
        status: "500",
        data: null,
      };
      return response;
    }
  }

  @Tags("Visitor")
  @OperationId("getAllVisitor")
  @Response<IResponse<GetVisitorDto[]>>(
    HttpStatusCode.BAD_REQUEST,
    "Bad Request"
  )
  @SuccessResponse(HttpStatusCode.OK, "OK")
  @Get("/admin")
  // @Security("jwt", ["SA"])
  public async getAllVisitors(): Promise<IResponse<any>> {
    try {
      const data = await getAllVisitorService();
      const response = {
        message: "Visitors retrieve successfully",
        status: "200",
        data: data,
      };
      return response;
    } catch (err) {
      this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
      const response = {
        message: "Failed to retrieve visitors",
        status: "500",
        data: null,
      };
      return response;
    }
  }

  @Tags("Visitor")
  @OperationId("editVisitorById")
  @Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, "Bad Request")
  @SuccessResponse(HttpStatusCode.OK, "OK")
  @Put("/edit")
  @Security("jwt", [])
  public async editVisitorById(
    @Body() editVisitorByIdDto: EditVisitorByIdDto,
    @Request() request: IGetUserAuthInfoRequest
  ): Promise<IResponse<any>> {
    try {
      if (!request.userId) {
        throw new OperationError(
          "User not found",
          HttpStatusCode.INTERNAL_SERVER_ERROR
        );
      }
      await editVisitorByIdService(editVisitorByIdDto, request.userId);
      const response = {
        message: "Visitor updated successfully",
        status: "200",
        data: null,
      };
      return response;
    } catch (err) {
      this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
      const response = {
        message: "Failed to update visitor",
        status: "500",
        data: null,
      };
      return response;
    }
  }
}
