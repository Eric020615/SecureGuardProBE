import {
  CancelFacilityBookingDto,
  CreateFacilityBookingDto,
  GetFacilityBookingHistoryDto,
} from "../dtos/facility.dto";
import { IResponse } from "../dtos/response.dto";
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
  Path,
  Put,
  Security,
  Request,
  Query,
} from "tsoa";
import { HttpStatusCode } from "../common/http-status-code";
import { IGetUserAuthInfoRequest } from "../middleware/security.middleware";
import { OperationError } from "../common/operation-error";
import { cancelFacilityBookingService, createFacilityBookingService, getAllFacilityBookingService, getFacilityBookingService } from "../services/facility.service";

@Route("facility")
export class FacilityController extends Controller {
  @Tags("Facility")
  @OperationId("createFacilityBooking")
  @Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, "Bad Request")
  @SuccessResponse(HttpStatusCode.OK, "OK")
  @Post("/create")
  @Security("jwt", ["resident", "admin"])
  public async createFacilityBooking(
    @Body() createFacilityBookingDto: CreateFacilityBookingDto,
    @Request() request: IGetUserAuthInfoRequest
  ): Promise<IResponse<any>> {
    try {
      if (!request.userId) {
        throw new OperationError(
          "USER_NOT_FOUND",
          HttpStatusCode.INTERNAL_SERVER_ERROR
        );
      }
      await createFacilityBookingService(createFacilityBookingDto, request.userId)
      const response = {
        message: "Facility booking created successfully",
        status: "200",
        data: null,
      };
      return response;
    } catch (err) {
      this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
      const response = {
        message: "Failed to create facility booking",
        status: "500",
        data: err,
      };
      return response;
    }
  }

  @Tags("Facility")
  @OperationId("getFacilityBooking")
  @Response<IResponse<GetFacilityBookingHistoryDto[]>>(HttpStatusCode.BAD_REQUEST, "Bad Request")
  @SuccessResponse(HttpStatusCode.OK, "OK")
  @Get("/")
  @Security("jwt", ["resident", "admin"])
  public async getFacilityBooking(
    @Request() request: IGetUserAuthInfoRequest,
    @Query() isPast: boolean
  ): Promise<IResponse<any>> {
    try {
      if (!request.userId) {
        throw new OperationError(
          "USER_NOT_FOUND",
          HttpStatusCode.INTERNAL_SERVER_ERROR
        );
      }
      const data = await getFacilityBookingService(request.userId, isPast)
      const response = {
        message: "Facility booking retrieve successfully",
        status: "200",
        data: data,
      };
      return response;
    } catch (err) {
      this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
      const response = {
        message: "Failed to retrieve facility booking",
        status: "500",
        data: null,
      };
      return response;
    }
  }

  @Tags("Facility")
  @OperationId("getAllFacilityBooking")
  @Response<IResponse<GetFacilityBookingHistoryDto[]>>(HttpStatusCode.BAD_REQUEST, "Bad Request")
  @SuccessResponse(HttpStatusCode.OK, "OK")
  @Get("/admin")
  @Security("jwt", ["admin"])
  public async getAllFacilityBooking(
  ): Promise<IResponse<any>> {
    try {
      const data = await getAllFacilityBookingService()
      const response = {
        message: "Facility booking retrieve successfully",
        status: "200",
        data: data,
      };
      return response;
    } catch (err) {
      this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
      const response = {
        message: "Failed to retrieve facility booking",
        status: "500",
        data: null,
      };
      return response;
    }
  }

  @Tags("Facility")
  @OperationId("cancelFacilityBooking")
  @Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, "Bad Request")
  @SuccessResponse(HttpStatusCode.OK, "OK")
  @Put("/cancel/{bookingId}")
  @Security("jwt", ["admin", "resident"])
  public async cancelFacilityBooking(
    @Request() request: IGetUserAuthInfoRequest,
    @Body() cancelFacilityBookingDto: CancelFacilityBookingDto,
    @Path() bookingId: string
  ): Promise<IResponse<any>> {
    try {
      if (!request.userId) {
        throw new OperationError(
          "USER_NOT_FOUND",
          HttpStatusCode.INTERNAL_SERVER_ERROR
        );
      }
      await cancelFacilityBookingService(request.userId, cancelFacilityBookingDto, bookingId)
      const response = {
        message: "Facility booking cancel successfully",
        status: "200",
        data: null,
      };
      return response;
    } catch (err) {
      this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
      const response = {
        message: "Failed to cancel facility booking",
        status: "500",
        data: null,
      };
      return response;
    }
  }
}