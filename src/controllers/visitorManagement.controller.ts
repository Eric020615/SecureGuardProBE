import { IPaginatedResponse, IResponse } from '../dtos/index.dto'
import {
	Controller,
	OperationId,
	Get,
	Response,
	Route,
	SuccessResponse,
	Tags,
	Security,
	Request,
	Query,
	Path,
} from 'tsoa'
import { HttpStatusCode } from '../common/http-status-code'
import { ISecurityMiddlewareRequest } from '../middleware/security.middleware'
import { OperationError } from '../common/operation-error'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { VisitorService } from '../services/visitor.service'
import { GetVisitorDto, GetVisitorByDateDto, GetVisitorDetailsDto } from '../dtos/visitor.dto'
import { PaginationDirectionEnum } from '../common/constants'

@Route('visitors/admin')
@provideSingleton(VisitorManagementController)
export class VisitorManagementController extends Controller {
	constructor(
		@inject(VisitorService) private visitorService: VisitorService,
	) {
		super()
	}

	@Tags('Visitor Management')
	@OperationId('getVisitorByAdmin')
	@Response<IResponse<GetVisitorDto[]>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Get('/')
	@Security('jwt', ['SA'])
	public async getVisitorByAdmin(
		@Request() request: ISecurityMiddlewareRequest,
		@Query() direction: PaginationDirectionEnum.Next | PaginationDirectionEnum.Previous,
		@Query() id: number,
		@Query() limit: number,
	): Promise<IPaginatedResponse<GetVisitorDto>> {
		try {
			if (!request.userGuid || !request.role) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const { data, count } = await this.visitorService.getVisitorByAdminService(direction, id, limit)
			const response = {
				message: 'Visitors retrieve successfully',
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
				message: 'Failed to retrieve visitors',
				status: '500',
				data: {
					list: null,
					count: 0,
				},
			}
			return response
		}
	}

	@Tags('Visitor Management')
	@OperationId('getVisitorDetails')
	@Response<IResponse<GetVisitorDetailsDto>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Get('/{id}/details')
	@Security('jwt', ['RES', 'SUB', 'SA'])
	public async getVisitorDetails(
		@Request() request: ISecurityMiddlewareRequest,
		@Path() id: string,
	): Promise<IResponse<GetVisitorDetailsDto>> {
		try {
			if (!request.userGuid) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const data = await this.visitorService.getVisitorDetailsService(id)
			const response = {
				message: 'Visitors retrieve successfully',
				status: '200',
				data: data,
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: 'Failed to retrieve visitors',
				status: '500',
				data: null,
			}
			return response
		}
	}

	@Tags('Visitor Management')
	@OperationId('getVisitorCountsByDay')
	@Response<IResponse<GetVisitorByDateDto[]>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Get('/analytics')
	@Security('jwt', ['SA'])
	public async getVisitorCountsByDay(
		@Request() request: ISecurityMiddlewareRequest,
		@Query() startDate: string,
		@Query() endDate: string,
	): Promise<IResponse<GetVisitorByDateDto>> {
		try {
			if (!request.userGuid || !request.role) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const data = await this.visitorService.getVisitorCountsByDayService(startDate, endDate)
			const response = {
				message: 'Visitors retrieve successfully',
				status: '200',
				data: data,
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: 'Failed to retrieve visitors',
				status: '500',
				data: null,
			}
			return response
		}
	}
}
