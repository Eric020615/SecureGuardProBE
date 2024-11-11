import { inject } from 'inversify'
import { provideSingleton } from '../helper/provideSingleton'
import { FaceAuthRepository } from '../repositories/faceAuth.repository'
import { FaceAuth } from '../models/faceAuth.model'
import { getCurrentDateString, getCurrentTimestamp } from '../helper/time'
import { OperationError } from '../common/operation-error'
import { HttpStatusCode } from '../common/http-status-code'
import { UserService } from './user.service'
import { MegeyeService } from './megeye.service'
import { MicroEngineService } from './microEngine.service'
import { DepartmentEnum, ITimeFormat, JobTitleEnum, RoleRecognitionTypeEnum, StaffConst } from '../common/constants'
import { CreateStaffDto } from '../dtos/microengine.dto'
import { RoleEnum } from '../common/role'
import { CreateUpdateFaceAuthDto } from '../dtos/faceAuth.dto'

@provideSingleton(FaceAuthService)
export class FaceAuthService {
	constructor(
		@inject(FaceAuthRepository)
		private faceAuthRepository: FaceAuthRepository,
		@inject(UserService) private userService: UserService,
		@inject(MegeyeService) private megeyeService: MegeyeService,
		@inject(MicroEngineService) private microEngineService: MicroEngineService,
	) {}

	createUpdateFaceAuth = async (userGuid: string, role: RoleEnum, createUpdateFaceAuthDto: CreateUpdateFaceAuthDto) => {
		try {
			const userData = await this.userService.getUserDetailsByIdService(userGuid)
			if (userData == null) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const effectiveUserGuid = await this.userService.getEffectiveUserGuidService(userGuid, role)

			// query user card and person details
			const userCard = await this.microEngineService.getUserById(`${userData.role} ${userData.userId.toString()}`)
			const personDetails = await this.megeyeService.queryPersonDetailsById(effectiveUserGuid)

			// if exists update the access control details
			if (userCard && personDetails) {
				await this.megeyeService.editPerson({
					recognition_type: RoleRecognitionTypeEnum[userData.role],
					is_admin: userData.role === RoleEnum.SYSTEM_ADMIN ? true : false,
					person_name: userData.firstName + ' ' + userData.lastName,
					group_list: ['1'],
					face_list: [
						{
							idx: 0,
							data: createUpdateFaceAuthDto.faceData.fileData,
						},
					],
					phone_num: userData.contactNumber,
				}, effectiveUserGuid)
				await this.faceAuthRepository.editFaceAuthRepository(userGuid, {
					updatedBy: userGuid,
					updatedDateTime: getCurrentTimestamp(),
				} as FaceAuth)
				return true
			}

			// if not exists create new card and person
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
				UserId: `${userData.role} ${userData.userId.toString()}`,
				UserName: userData.firstName + ' ' + userData.lastName,
				UserType: 'Normal',
			} as CreateStaffDto
			const badgeNumber = await this.microEngineService.addUser(staffInfo, userGuid)
			await this.megeyeService.createPerson({
				recognition_type: RoleRecognitionTypeEnum[userData.role],
				id: effectiveUserGuid,
				is_admin: userData.role === RoleEnum.SYSTEM_ADMIN ? true : false,
				person_name: userData.firstName + ' ' + userData.lastName,
				group_list: ['1'],
				face_list: [
					{
						idx: 0,
						data: createUpdateFaceAuthDto.faceData.fileData,
					},
				],
				person_code: `${role} ${userData.userId.toString()}`, // for display purpose
				phone_num: userData.contactNumber,
				card_number: badgeNumber.toString(),
			})
			await this.faceAuthRepository.createFaceAuthRepository(
				userGuid,
				new FaceAuth(userGuid, userGuid, getCurrentTimestamp(), getCurrentTimestamp()),
			)
			return true
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}
}
