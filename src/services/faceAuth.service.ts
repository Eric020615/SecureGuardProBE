import { inject } from 'inversify'
import { provideSingleton } from '../helper/provideSingleton'
import { FaceAuthRepository } from '../repositories/faceAuth.repository'
import { FaceAuth } from '../models/faceAuth.model'
import {
	addTimeToDateString,
	convertDateStringToFormattedString,
	getCurrentDateString,
	getCurrentTimestamp,
} from '../helper/time'
import { OperationError } from '../common/operation-error'
import { HttpStatusCode } from '../common/http-status-code'
import { UserService } from './user.service'
import { MegeyeService } from './megeye.service'
import { MicroEngineService } from './microEngine.service'
import { DepartmentEnum, ITimeFormat, JobTitleEnum, RoleRecognitionTypeEnum, StaffConst } from '../common/constants'
import { CreateStaffDto } from '../dtos/microengine.dto'
import { RoleEnum } from '../common/role'
import { CreateUpdateFaceAuthDto, CreateUpdateVisitorFaceAuthDto } from '../dtos/faceAuth.dto'
import { UserRepository } from '../repositories/user.repository'
import { User } from '../models/user.model'

@provideSingleton(FaceAuthService)
export class FaceAuthService {
	constructor(
		@inject(FaceAuthRepository)
		private faceAuthRepository: FaceAuthRepository,
		@inject(UserRepository)
		private userRepository: UserRepository,
		@inject(UserService) private userService: UserService,
		@inject(MegeyeService) private megeyeService: MegeyeService,
		@inject(MicroEngineService) private microEngineService: MicroEngineService,
	) {}

	createUpdateFaceAuth = async (userGuid: string, role: RoleEnum, createUpdateFaceAuthDto: CreateUpdateFaceAuthDto) => {
		try {
			// get user data
			const userData = await this.userService.getUserDetailsByIdService(userGuid)
			if (userData == null) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}

			// get effective user guid
			const effectiveUserGuid = await this.userService.getEffectiveUserGuidService(userGuid, role)

			// query user card and person details
			const userCard = await this.microEngineService.getUserById(`${userData.role} ${userData.userId.toString()}`)
			const personDetails = await this.megeyeService.queryPersonDetailsById(effectiveUserGuid)

			// if exists update the access control details
			if (userCard && personDetails) {
				await this.megeyeService.editPerson(
					{
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
					},
					effectiveUserGuid,
				)
				await this.faceAuthRepository.editFaceAuthRepository(userGuid, {
					updatedBy: userGuid,
					updatedDateTime: getCurrentTimestamp(),
				} as FaceAuth)
				return
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
					AccessEntryDate: getCurrentDateString(ITimeFormat.dateTime),
					AccessExitDate: addTimeToDateString(getCurrentDateString(ITimeFormat.date), 'years', 1, ITimeFormat.dateTime),
					DoorAccessRightId: '0001',
					FloorAccessRightId: '001',
					DefaultFloorGroupId: 'N/Available',
				},
				UserId: `${userData.role} ${userData.userId.toString()}`,
				UserName: userData.firstName + ' ' + userData.lastName,
				UserType: 'Normal',
			} as CreateStaffDto

			// create user card and person
			const badgeNumber = await this.microEngineService.addUser(staffInfo, userGuid)
			if (!badgeNumber) {
				throw new OperationError('Failed to create user card', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			await this.userRepository.editUserDetailsByIdRepository(userGuid, { badgeNumber: badgeNumber.toString() } as User)
			await this.microEngineService.sendByCardGuid()
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
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	createUpdateVisitorFaceAuth = async (
		staffGuid: string,
		createUpdateVisitorFaceAuthDto: CreateUpdateVisitorFaceAuthDto,
	) => {
		try {
			// get resident guid
			const residentGuid = await this.userService.getEffectiveUserGuidService(
				createUpdateVisitorFaceAuthDto.visitorDetails.visitorGuid,
				RoleEnum.VISITOR,
			)

			// query user card and person details
			const userCard = await this.microEngineService.getUserById(
				`${RoleEnum.VISITOR} ${createUpdateVisitorFaceAuthDto.visitorDetails.visitorId.toString()}`,
			)
			const personDetails = await this.megeyeService.queryPersonDetailsById(
				createUpdateVisitorFaceAuthDto.visitorDetails.visitorGuid
			)
			
			// if exists update face auth
			if (userCard && personDetails) {
				// update face auth
				await this.megeyeService.editPerson(
					{
						recognition_type: RoleRecognitionTypeEnum.VI,
						is_admin: false,
						person_name: createUpdateVisitorFaceAuthDto.visitorDetails.visitorName,
						group_list: ['1'],
						face_list: [
							{
								idx: 0,
								data: createUpdateVisitorFaceAuthDto.faceData.fileData,
							},
						],
						phone_num: createUpdateVisitorFaceAuthDto.visitorDetails.visitorContactNumber,
					},
					createUpdateVisitorFaceAuthDto.visitorDetails.visitorGuid,
				)
				await this.faceAuthRepository.editFaceAuthRepository(
					createUpdateVisitorFaceAuthDto.visitorDetails.visitorGuid,
					{
						updatedBy: staffGuid,
						updatedDateTime: getCurrentTimestamp(),
					} as FaceAuth,
				)
				return
			}

			// if not exists create new card and person
			let staffInfo = {
				...StaffConst,
				Profile: {
					Branch: 'HQ',
					Department: DepartmentEnum.VI,
					JobTitle: JobTitleEnum.VI,
					EmailAddress: createUpdateVisitorFaceAuthDto.visitorDetails.visitorEmail,
					ContactNo: createUpdateVisitorFaceAuthDto.visitorDetails.visitorContactNumber,
					Remark1: residentGuid,
				},
				AccessControlData: {
					AccessEntryDate: convertDateStringToFormattedString(
						createUpdateVisitorFaceAuthDto.visitorDetails.visitDateTime,
						ITimeFormat.dateTime,
					),
					AccessExitDate: addTimeToDateString(
						createUpdateVisitorFaceAuthDto.visitorDetails.visitDateTime,
						'hours',
						2,
						ITimeFormat.dateTime,
					),
					DoorAccessRightId: '0001',
					FloorAccessRightId: '001',
					DefaultFloorGroupId: 'N/Available',
				},
				UserId: `${RoleEnum.VISITOR} ${createUpdateVisitorFaceAuthDto.visitorDetails.visitorId.toString()}`,
				UserName: createUpdateVisitorFaceAuthDto.visitorDetails.visitorName,
				UserType: 'Normal',
			} as CreateStaffDto

			// create user card and person
			const badgeNumber = await this.microEngineService.addUser(
				staffInfo,
				createUpdateVisitorFaceAuthDto.visitorDetails.visitorGuid,
			)
			if (!badgeNumber) {
				throw new OperationError('Failed to create user card', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			//await this.microEngineService.sendByCardGuid()
			await this.megeyeService.createPerson({
				recognition_type: RoleRecognitionTypeEnum.VI,
				id: createUpdateVisitorFaceAuthDto.visitorDetails.visitorGuid,
				is_admin: false,
				person_name: createUpdateVisitorFaceAuthDto.visitorDetails.visitorName,
				group_list: ['1'],
				face_list: [
					{
						idx: 0,
						data: createUpdateVisitorFaceAuthDto.faceData.fileData,
					},
				],
				person_code: `${RoleEnum.VISITOR} ${createUpdateVisitorFaceAuthDto.visitorDetails.visitorId.toString()}`, // for display purpose
				phone_num: createUpdateVisitorFaceAuthDto.visitorDetails.visitorContactNumber,
				card_number: badgeNumber.toString(),
			})
			await this.faceAuthRepository.createFaceAuthRepository(
				createUpdateVisitorFaceAuthDto.visitorDetails.visitorGuid,
				new FaceAuth(staffGuid, staffGuid, getCurrentTimestamp(), getCurrentTimestamp()),
			)
		} catch (error: any) {
			console.log("shithist")
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}
}
