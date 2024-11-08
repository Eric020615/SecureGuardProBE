import { IResponse } from '../dtos/index.dto'
import {
	Body,
	Controller,
	OperationId,
	Post,
	Response,
	Route,
	SuccessResponse,
	Tags,
	Security,
	Request,
	Put,
} from 'tsoa'
import { HttpStatusCode } from '../common/http-status-code'
import { MegeyeService } from '../services/megeye.service'
import { ISecurityMiddlewareRequest } from '../middleware/security.middleware'
import { CreateUserFaceAuthDto } from '../dtos/faceAuth.dto'
import { OperationError } from '../common/operation-error'
import { RoleEnum } from '../common/role'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { UserService } from '../services/user.service'
import { FaceAuthService } from '../services/faceAuth.service'
import { MicroEngineService } from '../services/microEngineService'
import { CreateStaffDto } from '../dtos/microengine.dto'
import { DepartmentEnum, ITimeFormat, JobTitleEnum, RoleRecognitionTypeEnum, StaffConst } from '../common/constants'
import { getCurrentDateString } from '../helper/time'

@Route('face-auth')
@provideSingleton(FaceAuthController)
export class FaceAuthController extends Controller {
	constructor(
		@inject(UserService) private userService: UserService,
		@inject(MegeyeService) private megeyeService: MegeyeService,
		@inject(MicroEngineService) private microEngineService: MicroEngineService,
		@inject(FaceAuthService) private faceAuthService: FaceAuthService,
	) {
		super()
	}

	@Tags('FaceAuth')
	@OperationId('createFaceAuth')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Post('/')
	@Security('jwt', ['SA', 'STF', 'RES', 'SUB'])
	public async createFaceAuth(
		@Body() createUserFaceAuthDto: CreateUserFaceAuthDto,
		@Request() request: ISecurityMiddlewareRequest,
	): Promise<IResponse<any>> {
		try {
			if (!request.userGuid || !request.role) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const userData = await this.userService.getUserDetailsByIdService(request.userGuid)
			if (userData == null) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const userGuid = await this.userService.getEffectiveUserGuidService(request.userGuid, request.role)
			let staffInfo = {
				...StaffConst,
				Profile: {
					Branch: 'HQ',
					Department: DepartmentEnum[userData.role],
					JobTitle: JobTitleEnum[userData.role],
					EmailAddress: userData.email,
					ContactNo: userData.contactNumber,
				},
				AccessControlData: {
					AccessEntryDate: getCurrentDateString(ITimeFormat.date),
					AccessExitDate: '2025-12-31',
					DoorAccessRightId: '0001',
					FloorAccessRightId: '001',
					DefaultFloorGroupId: 'N/Available',
				},
				UserId: `${request.role} ${userData.userId.toString()}`,
				UserName: userData.firstName + ' ' + userData.lastName,
				UserType: 'Normal',
			} as CreateStaffDto
			const badgeNumber = await this.microEngineService.addUser(staffInfo, request.userGuid)
			const data = await this.megeyeService.createPerson({
				recognition_type: RoleRecognitionTypeEnum[userData.role],
				id: userGuid,
				is_admin: userData.role === RoleEnum.SYSTEM_ADMIN ? true : false,
				person_name: userData.firstName + ' ' + userData.lastName,
				group_list: ['1'],
				face_list: [
					{
						idx: 0,
						data: createUserFaceAuthDto.faceData.fileData,
					},
				],
				person_code: `${request.role} ${userData.userId.toString()}`,
				phone_num: userData.contactNumber,
				card_number: badgeNumber.toString(),
			})
			if (data) {
				this.faceAuthService.createFaceAuth(request.userGuid)
			}
			const response = {
				message: 'Successfully create user face auth',
				status: '200',
				data: null,
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

	@Tags('FaceAuth')
	@OperationId('updateUserFaceAuth')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Put('/')
	@Security('jwt', ['RES', 'SA'])
	public async updateUserFaceAuth(
		@Body() updateUserFaceAuthDto: CreateUserFaceAuthDto,
		@Request() request: ISecurityMiddlewareRequest,
	): Promise<IResponse<any>> {
		try {
			if (!request.userGuid || !request.role) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const userData = await this.userService.getUserDetailsByIdService(request.userGuid)
			if (userData == null) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const data = await this.megeyeService.editPerson({
				recognition_type: RoleRecognitionTypeEnum[userData.role],
				id: `${request.role} ${userData.userId.toString()}`,
				is_admin: userData.role === RoleEnum.SYSTEM_ADMIN ? true : false,
				person_name: userData.firstName + ' ' + userData.lastName,
				group_list: ['1'],
				face_list: [
					{
						idx: 0,
						data: updateUserFaceAuthDto.faceData.fileData,
					},
				],
				person_code: userData.userGuid,
				phone_num: userData.contactNumber,
			})
			const response = {
				message: 'Successfully update user face auth',
				status: '200',
				data: data,
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: 'Failed to update user face auth',
				status: '500',
				data: null,
			}
			return response
		}
	}
}
