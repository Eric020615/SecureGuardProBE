import { IResponse } from "../dtos/response.dto"
import { createNoticeService, deleteNoticeByIdService, editNoticeByIdService, getAllNoticeService, getNoticeByIdService, getNoticeService } from "../services/notice.service";
import { Body, Controller, OperationId, Post, Get, Response, Route, SuccessResponse, Tags, Put, Delete, Security, Request, Query } from "tsoa";
import { CreateNoticeDto, DeleteNoticeDto, GetNoticeDto, UpdateNoticeDto } from "../dtos/notice.dto";
import { HttpStatusCode } from "../common/http-status-code";
import { IGetUserAuthInfoRequest } from "../middleware/security.middleware";
import { OperationError } from "../common/operation-error";

@Route("notice")
export class NoticeController extends Controller {
    @Tags("Notice")
    @OperationId('createNotice')
    @Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
    @SuccessResponse(HttpStatusCode.OK, 'OK')
    @Post('/create')
    @Security("jwt", ["SA"])
    public async createNotice(
      @Body() createNoticeDto: CreateNoticeDto,
      @Request() request: IGetUserAuthInfoRequest
    ): Promise<IResponse<any>> {
      try {
        if(!request.userId){
          throw new OperationError(
            "User not found",
            HttpStatusCode.INTERNAL_SERVER_ERROR
          )
        }
        await createNoticeService(createNoticeDto, request.userId);
        this.setStatus(HttpStatusCode.OK);
        const response = {
            message: "Notices created successfully",
            status: "200",
            data: null,
        }
        return response;
      }
      catch(err) {
        console.log(err)
        this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
        const response = {
            message: "Failed to create notice",
            status: "500",
            data: err,
        }
        return response;
      } 
    }

    @Tags("Notice")
    @OperationId('getAllNotice')
    @Response<IResponse<GetNoticeDto[]>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
    @SuccessResponse(HttpStatusCode.OK, 'OK')
    @Get('/admin')
    @Security("jwt", ["SA"])
    public async getAllNotice(
    ): Promise<IResponse<GetNoticeDto[]>> {
      try {
        let data = await getAllNoticeService();
        const response = {
            message: "Notices retrieved successfully",
            status: "200",
            data: data,
        }
        return response;
      }
      catch(err) {
        this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
        const response = {
            message: "Failed to retrieve notices",
            status: "500",
            data: null,
        }
        return response;
      } 
    }

    @Tags("Notice")
    @OperationId('getNotice')
    @Response<IResponse<GetNoticeDto[]>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
    @SuccessResponse(HttpStatusCode.OK, 'OK')
    @Get('/')
    public async getNotice(
    ): Promise<IResponse<GetNoticeDto[]>> {
      try {
        let data = await getNoticeService();
        const response = {
            message: "Notices retrieved successfully",
            status: "200",
            data: data,
        }
        return response;
      }
      catch(err) {
        this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
        const response = {
            message: "Failed to retrieve notices",
            status: "500",
            data: null,
        }
        return response;
      } 
    }

    @Tags("Notice")
    @OperationId('getNoticeById')
    @Response<IResponse<GetNoticeDto>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
    @SuccessResponse(HttpStatusCode.OK, 'OK')
    @Get('/detail')
    public async getNoticeById(
      @Query() noticeId: string
    ): Promise<IResponse<GetNoticeDto>> {
      try {
        let data = await getNoticeByIdService(noticeId);
        const response = {
            message: "Notice retrieved successfully",
            status: "200",
            data: data,
        }
        return response;
      }
      catch(err) {
        this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
        const response = {
            message: "Failed to retrieve notice",
            status: "500",
            data: null,
        }
        return response;
      } 
    }

    @Tags("Notice")
    @OperationId('editNoticeById')
    @Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
    @SuccessResponse(HttpStatusCode.OK, 'OK')
    @Put('/update')
    @Security("jwt", ["SA"])
    public async editNoticeById(
      @Body() updateNoticeDto: UpdateNoticeDto,
      @Request() request: IGetUserAuthInfoRequest
    ): Promise<IResponse<any>> {
      try {
        if(!request.userId){
          throw new OperationError(
            "User not found",
            HttpStatusCode.INTERNAL_SERVER_ERROR
          )
        }
        await editNoticeByIdService(updateNoticeDto, request.userId);
        const response = {
            message: "Notice updated successfully",
            status: "200",
            data: null,
        }
        return response;
      }
      catch(err) {
        this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
        const response = {
            message: "Failed to update notice",
            status: "500",
            data: null,
        }
        return response;
      } 
    }

    @Tags("Notice")
    @OperationId('deleteNoticeById')
    @Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
    @SuccessResponse(HttpStatusCode.OK, 'OK')
    @Delete('/delete')
    public async deleteNoticeById(
      @Body() deleteNoticeDto: DeleteNoticeDto,
    ): Promise<IResponse<any>> {
      try {
        await deleteNoticeByIdService(deleteNoticeDto.noticeId);
        const response = {
            message: "Notice deleted successfully",
            status: "200",
            data: null,
        }
        return response;
      }
      catch(err) {
        this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
        const response = {
            message: "Failed to delete notice",
            status: "500",
            data: null,
        }
        return response;
      } 
    }
}