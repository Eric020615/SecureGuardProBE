import { IResponse } from "../dtos/response.dto"
import { Body, Controller, OperationId, Post, Get, Response, Route, SuccessResponse, Tags, Put, Delete, Security, Request, Query } from "tsoa";
import { HttpStatusCode } from "../common/http-status-code";
import { IGetUserAuthInfoRequest } from "../middleware/security.middleware";
import { OperationError } from "../common/operation-error";
import { CreateVisitorDto, GetVisitorDto } from "../dtos/visitor.dto";
import { createVisitorService, getAllVisitorService } from "../services/visitor.service";

@Route("visitor")
export class VisitorController extends Controller {
    @Tags("Visitor")
    @OperationId('createVisitor')
    @Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
    @SuccessResponse(HttpStatusCode.OK, 'OK')
    @Post('/create')
    @Security("jwt", ["resident", "admin"])
    public async createVisitor(
      @Body() createVisitorDto: CreateVisitorDto,
      @Request() request: IGetUserAuthInfoRequest
    ): Promise<IResponse<any>> {
      try {
        if(!request.userId){
          throw new OperationError(
            "User not found",
            HttpStatusCode.INTERNAL_SERVER_ERROR
          )
        }
        await createVisitorService(createVisitorDto, request.userId);
        this.setStatus(HttpStatusCode.OK);
        const response = {
            message: "Visitor created successfully",
            status: "200",
            data: null,
        }
        return response;
      }
      catch(err) {
        this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
        const response = {
            message: "Failed to create visitor",
            status: "500",
            data: err,
        }
        return response;
      } 
    }

    @Tags("Visitor")
    @OperationId("getAllVisitor")
    @Response<IResponse<GetVisitorDto[]>>(HttpStatusCode.BAD_REQUEST, "Bad Request")
    @SuccessResponse(HttpStatusCode.OK, "OK")
    @Get("/")
    // @Security("jwt", ["admin"])
    public async getAllVisitors(
    ): Promise<IResponse<any>> {
      try {
        const data = await getAllVisitorService()
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
}