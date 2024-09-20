import { IResponse } from '../dtos/index.dto'
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
	Security,
	Request,
} from 'tsoa'
import { HttpStatusCode } from '../common/http-status-code'
import { MegeyeService } from '../services/megeye.service'
import { IGetUserAuthInfoRequest } from '../middleware/security.middleware'
import { CreateUserFaceAuthDto } from '../dtos/faceAuth.dto'
import { OperationError } from '../common/operation-error'
import { RoleRecognitionTypeEnum } from '../common/megeye'
import { RoleEnum } from '../common/role'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { UserService } from '../services/user.service'

@Route('face-auth')
@provideSingleton(FaceAuthController)
export class FaceAuthController extends Controller {
	constructor(
		@inject(UserService) private userService: UserService,
		@inject(MegeyeService) private megeyeService: MegeyeService,
	) {
		super()
	}

	@Tags('FaceAuth')
	@OperationId('createPerson')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Get('/')
	//   @Security("jwt", ["RES", "SA"])
	public async createPerson(): Promise<IResponse<any>> {
		try {
			const data = await this.megeyeService.queryPersonnel()
			const response = {
				message: 'Successfully retrieved personnel',
				status: '200',
				data: data,
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: 'Failed to retrieve personnel',
				status: '500',
				data: null,
			}
			return response
		}
	}

	@Tags('FaceAuth')
	@OperationId('uploadUserFaceAuth')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Post('/user/upload')
	@Security('jwt', ['RES', 'SA'])
	public async uploadUserFaceAuth(
		@Body() createUserFaceAuthDto: CreateUserFaceAuthDto,
		@Request() request: IGetUserAuthInfoRequest,
	): Promise<IResponse<any>> {
		try {
			if (!request.userId || !request.role) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const userData = await this.userService.GetUserDetailsByIdService(request.userId)
			if (userData == null) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const data = await this.megeyeService.createPerson({
				recognition_type: RoleRecognitionTypeEnum[userData.role],
				id: userData.userId,
				is_admin: userData.role === RoleEnum.SYSTEM_ADMIN ? true : false,
				person_name: userData.firstName + ' ' + userData.lastName,
				group_list: ['1'],
				face_list: [
					{
						idx: 0,
						data: createUserFaceAuthDto.faceData,
					},
				],
				person_code: userData.userId,
				phone_num: userData.contactNumber,
			})
			const response = {
				message: 'Successfully create user face auth',
				status: '200',
				data: data,
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: 'Failed to create user face auth',
				status: '500',
				data: null,
			}
			return response
		}
	}
}
