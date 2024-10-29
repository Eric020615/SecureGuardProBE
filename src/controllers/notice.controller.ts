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
} from 'tsoa'
import { CreateNoticeDto, DeleteNoticeDto, EditNoticeDto, GetNoticeDetailsDto, GetNoticeDto } from '../dtos/notice.dto'
import { HttpStatusCode } from '../common/http-status-code'
import { ISecurityMiddlewareRequest } from '../middleware/security.middleware'
import { OperationError } from '../common/operation-error'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { PaginationDirection } from '../common/constants'

@Route('notice')
@provideSingleton(NoticeController)
export class NoticeController extends Controller {
	constructor(@inject(NoticeService) private noticeService: NoticeService) {
		super()
	}

	@Tags('Notice')
	@OperationId('createNotice')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Post('/create')
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

	@Tags('Notice')
	@OperationId('getNoticeByAdmin')
	@Response<IResponse<GetNoticeDto[]>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Get('/admin')
	@Security('jwt', ['SA'])
	public async getNoticeByAdmin(
		@Query() direction: PaginationDirection.Next | PaginationDirection.Previous,
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

	@Tags('Notice')
	@OperationId('getNotice')
	@Response<IResponse<GetNoticeDto[]>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Get('/')
	public async getNotice(@Query() id: number, @Query() limit: number): Promise<IPaginatedResponse<GetNoticeDto>> {
		try {
			let { data, count } = await this.noticeService.getNoticeService(id, limit)
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
				message: 'Notices retrieved successfully',
				status: '200',
				data: {
					list: null,
					count: 0,
				},
			}
			return response
		}
	}

	@Tags('Notice')
	@OperationId('getNoticeById')
	@Response<IResponse<GetNoticeDetailsDto>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Get('/details')
	@Security('jwt', ['RES', 'SUB', 'SA', 'STF'])
	public async getNoticeById(@Query() noticeGuid: string): Promise<IResponse<GetNoticeDetailsDto>> {
		try {
			let data = await this.noticeService.getNoticeDetailsByIdService(noticeGuid)
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

	@Tags('Notice')
	@OperationId('editNoticeById')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Put('/edit')
	@Security('jwt', ['SA'])
	public async editNoticeById(
		@Body() editNoticeDto: EditNoticeDto,
		@Request() request: ISecurityMiddlewareRequest,
	): Promise<IResponse<any>> {
		try {
			if (!request.userGuid) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			await this.noticeService.editNoticeByIdService(editNoticeDto, request.userGuid)
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

	@Tags('Notice')
	@OperationId('deleteNoticeById')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Delete('/delete')
	@Security('jwt', ['RES', 'SUB', 'SA', 'STF'])
	public async deleteNoticeById(@Body() deleteNoticeDto: DeleteNoticeDto): Promise<IResponse<any>> {
		try {
			await this.noticeService.deleteNoticeByIdService(deleteNoticeDto.noticeGuid)
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
