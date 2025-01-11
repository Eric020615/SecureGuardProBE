import { IPaginatedResponse, IResponse } from '../dto/index.dto'
import { NoticeService } from '../service/notice.service'
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
import { HttpStatusCode } from '../common/http-status-code'
import { ISecurityMiddlewareRequest } from '../middleware/security.middleware'
import { OperationError } from '../common/operation-error'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { PaginationDirectionEnum } from '../common/constants'
import { GetUserByAdminDto, GetUserDetailsByIdDto } from '../dto/user.dto'
import { UserService } from '../service/user.service'

@Route('users/admin')
@provideSingleton(UserManagementController)
export class UserManagementController extends Controller {
	constructor(@inject(UserService) private userService: UserService) {
		super()
	}

	@Tags('User Management')
	@OperationId('getUserListByAdmin')
	@Response<IResponse<GetUserByAdminDto[]>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Get('/')
	@Security('jwt', ['SA'])
	public async getUserList(
		@Query() isActive: boolean,
		@Query() direction: PaginationDirectionEnum.Next | PaginationDirectionEnum.Previous,
		@Query() id: number,
		@Query() limit: number,
	): Promise<IPaginatedResponse<GetUserByAdminDto>> {
		try {
			const { data, count } = await this.userService.getUserListByAdminService(isActive, direction, id, limit)
			const response = {
				message: 'User list retrieve successfully',
				status: '200',
				data: {
					list: data,
					count: count,
				},
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			console.log(err)
			const response = {
				message: 'Failed to retrieve user list',
				status: '500',
				data: {
					list: null,
					count: 0,
				},
			}
			return response
		}
	}

	@Tags('User Management')
	@OperationId('getUserDetailsById')
	@Response<IResponse<GetUserDetailsByIdDto>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Get('/{id}/details')
	@Security('jwt', ['SA'])
	public async getUserDetailsById(@Path() id: string): Promise<IResponse<any>> {
		try {
			const data = await this.userService.getUserDetailsByIdService(id)
			const response = {
				message: 'User details retrieve successfully',
				status: '200',
				data: data,
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: 'Failed to retrieve user details',
				status: '500',
				data: null,
			}
			return response
		}
	}

	@Tags('User Management')
	@OperationId('activateUserById')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Put('/{id}/activate')
	@Security('jwt', ['SA'])
	public async activateUserById(
		@Request() request: ISecurityMiddlewareRequest,
		@Path() id: string,
	): Promise<IResponse<any>> {
		try {
			if (!request.userGuid) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			await this.userService.activateUserByIdService(id, request.userGuid)
			const response = {
				message: 'User activated successfully',
				status: '200',
				data: null,
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: 'Failed to activate user',
				status: '500',
				data: null,
			}
			return response
		}
	}

	@Tags('User Management')
	@OperationId('deactivateUserById')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Put('/{id}/deactivate')
	@Security('jwt', ['SA'])
	public async deactivateUserById(
		@Request() request: ISecurityMiddlewareRequest,
		@Path() id: string,
	): Promise<IResponse<any>> {
		try {
			if (!request.userGuid) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			await this.userService.deactivateUserByIdService(id, request.userGuid)
			const response = {
				message: 'User was deactivated successfully',
				status: '200',
				data: null,
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: 'Failed to deactivate user',
				status: '500',
				data: null,
			}
			return response
		}
	}

	@Tags('User Management')
	@OperationId('deleteUserById')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Delete('/{id}')
	@Security('jwt', ['SA'])
	public async deleteUserById(
		@Request() request: ISecurityMiddlewareRequest,
		@Path() id: string,
	): Promise<IResponse<any>> {
		try {
			if (!request.userGuid) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			await this.userService.deleteUserByIdService(id, request.userGuid)
			const response = {
				message: 'User was deleted successfully',
				status: '200',
				data: null,
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: 'Failed to delete user',
				status: '500',
				data: null,
			}
			return response
		}
	}
}
