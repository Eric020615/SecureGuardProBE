import { IPaginatedResponse, IResponse } from '../dtos/index.dto'
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
	Security,
	Request,
	Query,
} from 'tsoa'
import { HttpStatusCode } from '../common/http-status-code'
import { ISecurityMiddlewareRequest } from '../middleware/security.middleware'
import { OperationError } from '../common/operation-error'
import { CreateVisitorDto, GetVisitorDto, EditVisitorByIdDto } from '../dtos/visitor.dto'
import { VisitorService } from '../services/visitor.service'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { UserService } from '../services/user.service'

@Route('visitor')
@provideSingleton(VisitorController)
export class VisitorController extends Controller {
	constructor(
		@inject(VisitorService) private visitorService: VisitorService,
		@inject(UserService) private userService: UserService,
	) {
		super()
	}

	@Tags('Visitor')
	@OperationId('createVisitor')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Post('/create')
	@Security('jwt', ['RES', 'SUB', 'SA'])
	public async createVisitor(
		@Body() createVisitorDto: CreateVisitorDto,
		@Request() request: ISecurityMiddlewareRequest,
	): Promise<IResponse<any>> {
		try {
			if (!request.userGuid) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const userGuid = await this.userService.getEffectiveUserGuidService(
				request.userGuid,
				request.role,
			)
			await this.visitorService.createVisitorService(createVisitorDto, userGuid)
			this.setStatus(HttpStatusCode.OK)
			const response = {
				message: 'Visitor created successfully',
				status: '200',
				data: null,
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: 'Failed to create visitor',
				status: '500',
				data: err,
			}
			return response
		}
	}

	@Tags('Visitor')
	@OperationId('getVisitorByResident')
	@Response<IResponse<GetVisitorDto[]>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Get('/')
	@Security('jwt', ['RES', 'SUB', 'SA'])
	public async getVisitorByResident(
		@Request() request: ISecurityMiddlewareRequest,
		@Query() isPast: boolean,
		@Query() page: number,
		@Query() limit: number,
	): Promise<IPaginatedResponse<GetVisitorDto>> {
		try {
			if (!request.userGuid) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const userGuid = await this.userService.getEffectiveUserGuidService(
				request.userGuid,
				request.role,
			)
			const { data, count } = await this.visitorService.getVisitorByResidentService(
				userGuid,
				isPast,
				page,
				limit,
			)
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

	@Tags('Visitor')
	@OperationId('getVisitorDetailsByResident')
	@Response<IResponse<GetVisitorDto>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Get('/details')
	@Security('jwt', ['RES'])
	public async getVisitorDetailsByResident(
		@Request() request: ISecurityMiddlewareRequest,
		@Query() visitorGuid: string,
	): Promise<IResponse<any>> {
		try {
			if (!request.userGuid) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const data = await this.visitorService.getVisitorDetailsByResidentService(visitorGuid)
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

	@Tags('Visitor')
	@OperationId('getAllVisitor')
	@Response<IResponse<GetVisitorDto[]>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Get('/admin')
	@Security('jwt', ['SA'])
	public async getAllVisitors(
		@Request() request: ISecurityMiddlewareRequest,
		@Query() page: number,
		@Query() limit: number,
	): Promise<IPaginatedResponse<GetVisitorDto>> {
		try {
			if (!request.userGuid || !request.role) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const { data, count } = await this.visitorService.getAllVisitorService(page, limit)
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

	@Tags('Visitor')
	@OperationId('editVisitorById')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Put('/edit')
	@Security('jwt', [])
	public async editVisitorById(
		@Body() editVisitorByIdDto: EditVisitorByIdDto,
		@Query() visitorGuid: string,
		@Request() request: ISecurityMiddlewareRequest,
	): Promise<IResponse<any>> {
		try {
			if (!request.userGuid) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const userGuid = await this.userService.getEffectiveUserGuidService(
				request.userGuid,
				request.role,
			)
			await this.visitorService.editVisitorByIdService(editVisitorByIdDto, visitorGuid, userGuid)
			const response = {
				message: 'Visitor updated successfully',
				status: '200',
				data: null,
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: 'Failed to update visitor',
				status: '500',
				data: null,
			}
			return response
		}
	}
}
