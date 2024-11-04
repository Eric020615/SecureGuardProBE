import { IPaginatedResponse, IResponse } from '../dtos/index.dto'
import { NoticeService } from '../services/notice.service'
import {
	Controller,
	OperationId,
	Get,
	Response,
	Route,
	SuccessResponse,
	Tags,
	Security,
	Query,
	Path,
} from 'tsoa'
import { GetNoticeDetailsDto, GetNoticeDto } from '../dtos/notice.dto'
import { HttpStatusCode } from '../common/http-status-code'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'

@Route('notices')
@provideSingleton(NoticeController)
export class NoticeController extends Controller {
	constructor(@inject(NoticeService) private noticeService: NoticeService) {
		super()
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
	@Get('/{id}/details')
	@Security('jwt', ['RES', 'SUB', 'SA', 'STF'])
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
}
