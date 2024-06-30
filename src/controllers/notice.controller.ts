import { IResponse } from "../dtos/response.dto"
import { createNoticeService, deleteNoticeByIdService, editNoticeByIdService, getAllNoticeService, getNoticeByIdService, getNoticeService } from "../services/notice.service";
import { Body, Controller, OperationId, Post, Get, Response, Route, SuccessResponse, Tags, Path, Put, Delete, Security } from "tsoa";
import { CreateNoticeDto, GetNoticeDto, UpdateNoticeDto } from "../dtos/notice.dto";
import { HttpStatusCode } from "../common/http-status-code";

@Route("notice")
export class NoticeController extends Controller {
    @Tags("Notice")
    @OperationId('createNotice')
    @Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
    @SuccessResponse(HttpStatusCode.OK, 'OK')
    @Post('/create')
    public async createNotice(
      @Body() createNoticeDto: CreateNoticeDto
    ): Promise<IResponse<any>> {
      try {
        await createNoticeService(createNoticeDto);
        this.setStatus(HttpStatusCode.OK);
        const response = {
            message: "Notices created successfully",
            status: "200",
            data: null,
        }
        return response;
      }
      catch(err) {
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
    @Response<IResponse<GetNoticeDto>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
    @SuccessResponse(HttpStatusCode.OK, 'OK')
    @Get('/admin')
    @Security("jwt", ["admin"])
    public async getAllNotice(
    ): Promise<IResponse<GetNoticeDto>> {
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
    @Response<IResponse<GetNoticeDto>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
    @SuccessResponse(HttpStatusCode.OK, 'OK')
    @Get('/')
    public async getNotice(
    ): Promise<IResponse<GetNoticeDto>> {
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
    @Get('{id}')
    public async getNoticeById(
      @Path() id: string
    ): Promise<IResponse<GetNoticeDto>> {
      try {
        let data = await getNoticeByIdService(id);
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
    @Put('/update/{id}')
    public async editNoticeById(
      @Path() id: string,
      @Body() updateNoticeDto: UpdateNoticeDto
    ): Promise<IResponse<any>> {
      try {
        await editNoticeByIdService(id, updateNoticeDto);
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
    @Delete('/delete/{id}')
    public async deleteNoticeById(
      @Path() id: string,
    ): Promise<IResponse<any>> {
      try {
        await deleteNoticeByIdService(id);
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