import { IPaginatedResponse, IResponse } from '../dtos/index.dto'
import { NoticeService } from '../services/notice.service'
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
	Path,
} from 'tsoa'
import { CreateNoticeDto, EditNoticeDto, GetNoticeDetailsDto, GetNoticeDto } from '../dtos/notice.dto'
import { HttpStatusCode } from '../common/http-status-code'
import { ISecurityMiddlewareRequest } from '../middleware/security.middleware'
import { OperationError } from '../common/operation-error'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { PaginationDirectionEnum } from '../common/constants'

@Route('notices/admin')
@provideSingleton(NoticeManagementController)
export class NoticeManagementController extends Controller {
	constructor(@inject(NoticeService) private noticeService: NoticeService) {
		super()
	}

	@Tags('Notice Management')
	@OperationId('createNotice')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Post('/')
	@Security('jwt', ['SA'])
	public async createNotice(
		@Body() createNoticeDto: CreateNoticeDto,
		@Request() request: ISecurityMiddlewareRequest,
	): Promise<IResponse<any>> {
		try {
			if (!request.userGuid) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			await this.noticeService.createNoticeService(createNoticeDto, request.userGuid)
			this.setStatus(HttpStatusCode.OK)
			const response = {
				message: 'Notices created successfully',
				status: '200',
				data: null,
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: 'Failed to create notice',
				status: '500',
				data: err,
			}
			return response
		}
	}

	@Tags('Notice Management')
	@OperationId('getNoticeByAdmin')
	@Response<IResponse<GetNoticeDto[]>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Get('/')
	@Security('jwt', ['SA'])
	public async getNoticeByAdmin(
		@Query() direction: PaginationDirectionEnum.Next | PaginationDirectionEnum.Previous,
		@Query() id: number,
		@Query() limit: number,
	): Promise<IPaginatedResponse<GetNoticeDto>> {
		try {
			let { data, count } = await this.noticeService.getNoticeByAdminService(direction, id, limit)
			const response = {
				message: 'Notices retrieved successfully',
				status: '200',
				data: {
					list: data,
					count: count,
				},
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: 'Failed to retrieve notices',
				status: '500',
				data: {
					list: null,
					count: 0,
				},
			}
			return response
		}
	}

	@Tags('Notice Management')
	@OperationId('getNoticeById')
	@Response<IResponse<GetNoticeDetailsDto>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Get('/{id}/details')
	@Security('jwt', ['SA'])
	public async getNoticeById(@Path() id: string): Promise<IResponse<GetNoticeDetailsDto>> {
		try {
			let data = await this.noticeService.getNoticeDetailsByIdService(id)
			const response = {
				message: 'Notice retrieved successfully',
				status: '200',
				data: data,
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: 'Failed to retrieve notice',
				status: '500',
				data: null,
			}
			return response
		}
	}

	@Tags('Notice Management')
	@OperationId('editNoticeById')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Put('/{id}')
	@Security('jwt', ['SA'])
	public async editNoticeById(
		@Path() id: string,
		@Body() editNoticeDto: EditNoticeDto,
		@Request() request: ISecurityMiddlewareRequest,
	): Promise<IResponse<any>> {
		try {
			if (!request.userGuid) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			await this.noticeService.editNoticeByIdService(id, editNoticeDto, request.userGuid)
			const response = {
				message: 'Notice updated successfully',
				status: '200',
				data: null,
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: 'Failed to update notice',
				status: '500',
				data: null,
			}
			return response
		}
	}

	@Tags('Notice Management')
	@OperationId('deleteNoticeById')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Delete('/{id}')
	@Security('jwt', ['RES', 'SUB', 'SA', 'STF'])
	public async deleteNoticeById(@Path() id: string): Promise<IResponse<any>> {
		try {
			await this.noticeService.deleteNoticeByIdService(id)
			const response = {
				message: 'Notice deleted successfully',
				status: '200',
				data: null,
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: 'Failed to delete notice',
				status: '500',
				data: null,
			}
			return response
		}
	}
}
