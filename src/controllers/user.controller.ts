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
} from 'tsoa'
import { IResponse } from '../dtos/index.dto'
import { HttpStatusCode } from '../common/http-status-code'
import { OperationError } from '../common/operation-error'
import { IGetUserAuthInfoRequest } from '../middleware/security.middleware'
import {
	activateUserByIdService,
	createUserService,
	deactivateUserByIdService,
	editUserDetailsByIdService,
	GetUserDetailsByIdService,
	GetUserListService,
} from '../services/user.service'
import {
	CreateResidentDto,
	CreateSystemAdminDto,
	EditUserDetailsByIdDto,
	GetUserDetailsByIdDto,
	GetUserDto,
} from '../dtos/user.dto'
import { MegeyeService } from '../services/megeye.service'
import { RoleRecognitionTypeEnum } from '../common/megeye'

@Route('user')
export class UserController extends Controller {
	private megeyeService: MegeyeService

	constructor() {
		super()
		this.megeyeService = new MegeyeService()
	}

	@Tags('User')
	@OperationId('createUser')
	@Response<IResponse<any>>('400', 'Bad Request')
	@SuccessResponse('200', 'OK')
	@Post('/create')
	@Security('newUser', ['RES', 'SA'])
	public async createUser(
		@Request() request: IGetUserAuthInfoRequest,
		@Body() createUserDto: CreateResidentDto | CreateSystemAdminDto,
	): Promise<IResponse<any>> {
		try {
			if (!request.userId || !request.role) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			await createUserService(createUserDto, request.userId, request.role)
			await this.megeyeService.createPerson({
				recognition_type: RoleRecognitionTypeEnum[request.role],
				is_admin: false,
				person_name: createUserDto.firstName + ' ' + createUserDto.lastName,
				group_list: ['1'],
				phone_num: createUserDto.contactNumber,
			})
			const response = {
				message: 'User Created successfully',
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
	public async getUserList(@Query() isActive: boolean): Promise<IResponse<any>> {
		try {
			const data = await GetUserListService(isActive)
			const response = {
				message: 'User list retrieve successfully',
				status: '200',
				data: data,
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			console.log(err)
			const response = {
				message: 'Failed to retrieve user list',
				status: '500',
				data: null,
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
		@Request() request: IGetUserAuthInfoRequest,
	): Promise<IResponse<any>> {
		try {
			if (!request.userId || !request.role) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const data = await GetUserDetailsByIdService(request.userId)
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
	@OperationId('editUserProfileById')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Put('/profile')
	@Security('jwt', ['SA', 'RES'])
	public async editUserProfileById(
		@Body() editUserDetailsByIdDto: EditUserDetailsByIdDto,
		@Request() request: IGetUserAuthInfoRequest,
	): Promise<IResponse<any>> {
		try {
			if (!request.userId) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			await editUserDetailsByIdService(editUserDetailsByIdDto, request.userId)
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
	public async getUserDetailsById(@Query() userId: string): Promise<IResponse<any>> {
		try {
			const data = await GetUserDetailsByIdService(userId)
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
		@Request() request: IGetUserAuthInfoRequest,
		@Query() userId: string,
	): Promise<IResponse<any>> {
		try {
			if (!request.userId) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			await activateUserByIdService(userId, request.userId)
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
		@Request() request: IGetUserAuthInfoRequest,
		@Query() userId: string,
	): Promise<IResponse<any>> {
		try {
			if (!request.userId) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			await deactivateUserByIdService(userId, request.userId)
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
}
