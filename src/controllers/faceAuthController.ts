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
import { CreateFaceAuthStaffDto, CreateUserFaceAuthDto } from '../dtos/faceAuth.dto'
import { OperationError } from '../common/operation-error'
import { RoleRecognitionTypeEnum } from '../common/megeye'
import { RoleEnum } from '../common/role'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { UserService } from '../services/user.service'
import { FaceAuthService } from '../services/faceAuth.service'
import { MicroEngineService } from '../services/microEngineService'
import { CreateStaffDto } from '../dtos/microengine.dto'

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
	@Security('jwt', ['RES', 'SA'])
	public async createFaceAuth(
		@Body() createFaceAuthStaffDto: CreateFaceAuthStaffDto,
		@Request() request: ISecurityMiddlewareRequest,
	): Promise<IResponse<any>> {
		try {
			if (!request.userGuid || !request.role) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const userData = await this.userService.getUserDetailsByIdService(request.userGuid)

			// Determine the department based on the role
			const department =
				request.role === RoleEnum.SYSTEM_ADMIN
					? 'Admin'
					: request.role === RoleEnum.RESIDENT
					? 'Tenant'
					: request.role === RoleEnum.RESIDENT_SUBUSER
					? 'Subuser'
					: 'Unknown' // You can customize this further as needed

			const jobTitle =
				request.role === RoleEnum.SYSTEM_ADMIN
					? 'Manager'
					: request.role === RoleEnum.RESIDENT || request.role === RoleEnum.RESIDENT_SUBUSER
					? 'Resident'
					: request.role === RoleEnum.STAFF
					? 'Staff'
					: 'Unknown' // You can customize this further as needed

			let staffInfo = {
				Profile: {
					NRIC: '', // Assuming NRIC can be the GUID or adjust as needed
					Branch: 'HQ',
					Department: department,
					Division: 'N/Available',
					JobTitle: jobTitle, // Use user's role as the job title or adjust as necessary
					Company: 'Microengine', // Replace with actual company data if available
					EmailAddress: userData.email,
					ContactNo: userData.contactNumber,
					AttendanceDoorGroup: 'All Doors',
					HolidaySet: 'Default',
					Shift: 'Default',
					VehicleNo: '', // Adjust if vehicle number data is available
					ParkingLot: '', // Adjust if parking lot data is available
					Remark1: '',
					Remark2: '',
					Remark3: '',
					UserDefinedField1: '',
					UserDefinedField2: '',
					UserDefinedField3: '',
					UserDefinedField4: '',
					UserDefinedField5: '',
					UserDefinedField6: '',
					UserDefinedField7: '',
					UserDefinedField8: '',
				},
				UserId: userData.userId.toString(),
				UserName: userData.userName,
				UserType: 'Normal',
				...createFaceAuthStaffDto,
			} as CreateStaffDto
			const data = await this.microEngineService.addUser(staffInfo, request.userGuid)
			const response = {
				message: 'Successfully create face auth',
				status: '200',
				data: data,
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			console.log(err)
			const response = {
				message: 'Failed to create face auth',
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
			const data = await this.megeyeService.createPerson({
				recognition_type: RoleRecognitionTypeEnum[userData.role],
				id: `${request.role} ${userData.userId.toString()}`,
				is_admin: userData.role === RoleEnum.SYSTEM_ADMIN ? true : false,
				person_name: userData.firstName + ' ' + userData.lastName,
				group_list: ['1'],
				face_list: [
					{
						idx: 0,
						data: createUserFaceAuthDto.faceData.fileData,
					},
				],
				person_code: userGuid,
				phone_num: userData.contactNumber,
				card_number: '1',
			})
			if (data) {
				this.faceAuthService.createFaceAuth(request.userGuid)
			}
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

	@Tags('FaceAuth')
	@OperationId('updateUserFaceAuth')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Put('/user/update')
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
