import {
	Controller,
	Route,
	Post,
	Tags,
	OperationId,
	Response,
	SuccessResponse,
	Body,
	Security,
	Get,
	Request,
	Query,
	Put,
	Delete,
} from 'tsoa'
import { IResponse } from '../dtos/index.dto'
import { HttpStatusCode } from '../common/http-status-code'
import { OperationError } from '../common/operation-error'
import { ISecurityMiddlewareRequest } from '../middleware/security.middleware'
import { UserService } from '../services/user.service'
import {
	CreateSubUserRequestDto,
	DeleteSubUserByIdDto,
	EditUserDetailsByIdDto,
	GetUserDetailsByIdDto,
	GetUserDto,
} from '../dtos/user.dto'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'

@Route('user')
@provideSingleton(UserController)
export class UserController extends Controller {
	constructor(@inject(UserService) private userService: UserService) {
		super()
	}

	@Tags('User')
	@OperationId('createUser')
	@Response<IResponse<any>>('400', 'Bad Request')
	@SuccessResponse('200', 'OK')
	@Post('/create')
	@Security('newUser', ['RES', 'SA', 'SUB'])
	public async createUser(
		@Request() request: ISecurityMiddlewareRequest,
		@Body() createUserDto: any,
	): Promise<IResponse<any>> {
		try {
			if (!request.userGuid || !request.role) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			await this.userService.createUserService(createUserDto, request.userGuid, request.role)
			const response = {
				message: 'User created successfully',
				status: '200',
				data: null,
			}
			return response
		} catch (err: any) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: err.message ? err.message : '',
				status: '500',
				data: null,
			}
			return response
		}
	}

	@Tags('User')
	@OperationId('getUserList')
	@Response<IResponse<GetUserDto[]>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Get('/user-list')
	@Security('jwt', ['SA'])
	public async getUserList(
		@Query() isActive: boolean,
		@Query() page: number,
		@Query() limit: number,
	): Promise<IResponse<any>> {
		try {
			const { data, count } = await this.userService.getUserListService(isActive, page, limit)
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

	@Tags('User')
	@OperationId('getUserProfileById')
	@Response<IResponse<GetUserDetailsByIdDto>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Get('/profile')
	@Security('jwt', ['SA', 'RES'])
	public async getUserProfileById(
		@Request() request: ISecurityMiddlewareRequest,
	): Promise<IResponse<any>> {
		try {
			if (!request.userGuid || !request.role) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const data = await this.userService.getUserDetailsByIdService(request.userGuid)
			const response = {
				message: 'User details retrieve successfully',
				status: '200',
				data: data,
			}
			return response
		} catch (err) {
			console.log(err)
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: 'Failed to retrieve user details',
				status: '500',
				data: null,
			}
			return response
		}
	}

	@Tags('User')
	@OperationId('editUserProfileById')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Put('/profile')
	@Security('jwt', ['SA', 'RES'])
	public async editUserProfileById(
		@Body() editUserDetailsByIdDto: EditUserDetailsByIdDto,
		@Request() request: ISecurityMiddlewareRequest,
	): Promise<IResponse<any>> {
		try {
			if (!request.userGuid) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			await this.userService.editUserDetailsByIdService(editUserDetailsByIdDto, request.userGuid)
			const response = {
				message: 'User profile updated successfully',
				status: '200',
				data: null,
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: 'Failed to update user profile',
				status: '500',
				data: null,
			}
			return response
		}
	}

	@Tags('User')
	@OperationId('getUserDetailsById')
	@Response<IResponse<GetUserDetailsByIdDto>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Get('/details')
	@Security('jwt', ['SA'])
	public async getUserDetailsById(@Query() userGuid: string): Promise<IResponse<any>> {
		try {
			const data = await this.userService.getUserDetailsByIdService(userGuid)
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

	@Tags('User')
	@OperationId('activateUserById')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Put('/activate')
	@Security('jwt', ['SA'])
	public async activateUserById(
		@Request() request: ISecurityMiddlewareRequest,
		@Query() userGuid: string,
	): Promise<IResponse<any>> {
		try {
			if (!request.userGuid) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			await this.userService.activateUserByIdService(userGuid, request.userGuid)
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

	@Tags('User')
	@OperationId('deactivateUserById')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Put('/deactivate')
	@Security('jwt', ['SA'])
	public async deactivateUserById(
		@Request() request: ISecurityMiddlewareRequest,
		@Query() userGuid: string,
	): Promise<IResponse<any>> {
		try {
			if (!request.userGuid) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			await this.userService.deactivateUserByIdService(userGuid, request.userGuid)
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

	@Tags('User')
	@OperationId('createSubUserRequest')
	@Response<IResponse<any>>('400', 'Bad Request')
	@SuccessResponse('200', 'OK')
	@Post('/sub-user/create')
	@Security('jwt', ['RES'])
	public async createSubUserRequest(
		@Request() request: ISecurityMiddlewareRequest,
		@Body() createSubUserRequestDto: CreateSubUserRequestDto,
	): Promise<IResponse<any>> {
		try {
			if (!request.userGuid || !request.role) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			await this.userService.createSubUserRequestService(createSubUserRequestDto, request.userGuid)
			const response = {
				message: 'Sub user invitation link had been sent successfully',
				status: '200',
				data: null,
			}
			return response
		} catch (err: any) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: err.message ? err.message : '',
				status: '500',
				data: null,
			}
			return response
		}
	}

	@Tags('User')
	@OperationId('getSubUserListByResident')
	@Response<IResponse<GetUserDto[]>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Get('/sub-user/list')
	@Security('jwt', ['RES'])
	public async getSubUserList(
		@Query() page: number,
		@Query() limit: number,
		@Request() request: ISecurityMiddlewareRequest,
	): Promise<IResponse<any>> {
		try {
			if (!request.userGuid || !request.role) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const { data, count } = await this.userService.getSubUserListByResidentService(
				request.userGuid,
				page,
				limit,
			)
			const response = {
				message: 'Sub user list retrieve successfully',
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
				message: 'Failed to retrieve sub user list',
				status: '500',
				data: {
					list: null,
					count: 0,
				},
			}
			return response
		}
	}

	@Tags('User')
	@OperationId('editSubUserStatusById')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Put('/sub-user')
	@Security('jwt', ['RES'])
	public async editSubUserStatusById(
		@Query() subUserGuid: string,
		@Query() status: boolean,
		@Request() request: ISecurityMiddlewareRequest,
	): Promise<IResponse<any>> {
		try {
			if (!request.userGuid || !request.role) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			await this.userService.editSubUserStatusByIdService(subUserGuid, request.userGuid, status)
			const response = {
				message: 'Sub user status updated successfully',
				status: '200',
				data: null
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: 'Failed to update sub user status',
				status: '500',
				data: null
			}
			return response
		}
	}

	@Tags('User')
	@OperationId('deleteSubUserById')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Delete('/sub-user')
	@Security('jwt', ['RES'])
	public async deleteSubUserById(
		@Body() deleteSubUserByIdDto: DeleteSubUserByIdDto,
		@Request() request: ISecurityMiddlewareRequest,
	): Promise<IResponse<any>> {
		try {
			if (!request.userGuid || !request.role) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			await this.userService.deleteSubUserByIdService(deleteSubUserByIdDto.subUserGuid, request.userGuid)
			const response = { 
				message: 'Sub user deleted successfully',
				status: '200',
				data: null,
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: 'Failed to delete sub user',
				status: '500',
				data: null,
			}
			return response
		}
	}
}
