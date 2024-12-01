import { inject } from 'inversify'
import { provideSingleton } from '../helper/provideSingleton'
import { OperationError } from '../common/operation-error'
import { HttpStatusCode } from '../common/http-status-code'
import { UserService } from './user.service'
import { MicroEngineService } from './microEngine.service'
import {
	CreateUpdateFaceAuthDto,
	CreateUpdateVisitorFaceAuthDto,
	GetCardByUserDto,
	GetQrCodeByUserDto,
} from '../dtos/card.dto'
import { RoleEnum } from '../common/role'
import {
	DepartmentEnum,
	DocumentStatusEnum,
	ITimeFormat,
	JobTitleEnum,
	RoleRecognitionTypeEnum,
	StaffConst,
} from '../common/constants'
import { CreateStaffDto } from '../dtos/microengine.dto'
import {
	addTimeToDateString,
	convertDateStringToFormattedString,
	getCurrentDateString,
	getCurrentTimestamp,
} from '../helper/time'
import { UserRepository } from '../repositories/user.repository'
import { MegeyeService } from './megeye.service'
import { CardRepository } from '../repositories/card.repository'
import { Cards } from '../models/cards.model'
import { Users } from '../models/users.model'

@provideSingleton(CardService)
export class CardService {
	constructor(
		@inject(UserService) private userService: UserService,
		@inject(MicroEngineService) private microEngineService: MicroEngineService,
		@inject(MegeyeService)
		private megeyeService: MegeyeService,
		@inject(UserRepository) private userRepository: UserRepository,
		@inject(CardRepository) private cardRepository: CardRepository,
	) {}

	// create card
	createCardService = async (userGuid: string, role: RoleEnum) => {
		try {
			const userData = await this.userService.getUserDetailsByIdService(userGuid)
			if (userData.badgeNumber !== '') {
				throw new Error('User card already exists')
			}
			const badgeNumber = await this.createBadgeNumber(userGuid, role)
			await this.userRepository.editUserDetailsByIdRepository(userGuid, { badgeNumber: badgeNumber.toString() } as Users)
		} catch (error) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	getUserCardService = async (userGuid: string) => {
		try {
			const userData = await this.userService.getUserDetailsByIdService(userGuid)
			if (userData == null) {
				throw new Error('User not found')
			}
			if (userData.badgeNumber === '') {
				throw new Error('User card not found. Please create a card first')
			}
			let data: GetCardByUserDto
			data = {
				badgeNumber: userData.badgeNumber,
				cardHolder: userData.firstName + ' ' + userData.lastName,
			}
			return data
		} catch (error) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	createQrCodeService = async (userGuid: string, role: RoleEnum) => {
		try {
			// get user data
			const userData = await this.userService.getUserDetailsByIdService(userGuid)

			if (userData == null) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}

			if (userData.badgeNumber === '') {
				throw new OperationError('User card not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}

			// get effective user guid
			const referralUserGuid = await this.userService.getEffectiveUserGuidService(userGuid, role)

			// if not exists create new card and person
			let staffInfo = {
				...StaffConst,
				Card: {
					...StaffConst.Card,
					BadgeCategory: 'QRCode',
					Token: 'Card',
				},
				Profile: {
					...StaffConst.Profile,
					Department: DepartmentEnum[userData.role],
					JobTitle: JobTitleEnum[userData.role],
					EmailAddress: userData.email,
					ContactNo: userData.contactNumber,
					Remark1: `userGuid: ${userData.userId.toString()}`,
					Remark2: `referralUserGuid ${userData.role == RoleEnum.RESIDENT_SUBUSER ? referralUserGuid : ''}`,
				},
				AccessControlData: {
					...StaffConst.AccessControlData,
					AccessEntryDate: getCurrentDateString(ITimeFormat.dateTime),
					AccessExitDate: addTimeToDateString(getCurrentDateString(ITimeFormat.date), 'years', 1, ITimeFormat.dateTime),
				},
				UserId: `${userData.role} ${userData.userId.toString()} QR`,
				UserName: userData.firstName + ' ' + userData.lastName,
				UserType: 'Normal',
			} as CreateStaffDto

			// create user card in microengine
			await this.microEngineService.addUser(staffInfo, userGuid, userData.badgeNumber)
			await this.microEngineService.sendByCardGuid()
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	getQrCodeByUserService = async (userGuid: string) => {
		try {
			const userData = await this.userService.getUserDetailsByIdService(userGuid)
			if (userData == null) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			let data: GetQrCodeByUserDto = {} as GetQrCodeByUserDto
			const userCard = await this.microEngineService.getUserQrCode(
				`${userData.role} ${userData.userId.toString()} QR`,
				userData.badgeNumber,
			)
			if (!userCard) {
				return data
			}
			data = {
				badgeNumber: userCard.Result?.BadgeNo ? userCard.Result?.BadgeNo : '',
				data: userCard.Result?.Data ? userCard.Result?.Data : '',
			}
			return data
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	getQrCodeByVisitorService = async (visitorId: number, badgeNumber: string) => {
		try {
			let data: GetQrCodeByUserDto
			const userCard = await this.microEngineService.getUserQrCode(
				`${RoleEnum.VISITOR} ${visitorId.toString()}`,
				badgeNumber,
			)
			if (!userCard) {
				throw new OperationError('User card not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			data = {
				badgeNumber: userCard.Result?.BadgeNo ? userCard.Result?.BadgeNo : '',
				data: userCard.Result?.Data ? userCard.Result?.Data : '',
			}
			return data
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	createUpdateFaceAuthService = async (
		userGuid: string,
		role: RoleEnum,
		createUpdateFaceAuthDto: CreateUpdateFaceAuthDto,
	) => {
		try {
			// get user data
			const userData = await this.userService.getUserDetailsByIdService(userGuid)
			if (userData == null) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			if (userData.badgeNumber === '') {
				throw new OperationError('User card not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
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
			await this.microEngineService.addUser(staffInfo, userGuid, userData.badgeNumber)
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
				person_code: `${role} ${userData.userId.toString()} FR`, // for display purpose
				phone_num: userData.contactNumber,
				card_number: userData.badgeNumber,
			})
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	createUpdateVisitorFaceAuthService = async (
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
				createUpdateVisitorFaceAuthDto.visitorDetails.visitorGuid,
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
				return
			}

			// if not exists create new card and person
			let staffInfo = {
				...StaffConst,
				Profile: {
					...StaffConst.Profile,
					Department: DepartmentEnum.VI,
					JobTitle: JobTitleEnum.VI,
					EmailAddress: createUpdateVisitorFaceAuthDto.visitorDetails.visitorEmail,
					ContactNo: createUpdateVisitorFaceAuthDto.visitorDetails.visitorContactNumber,
					Remark1: `Resident userGuid: ${residentGuid}`,
					Remark2: `Staff PIC userGuid: ${staffGuid}`,
				},
				AccessControlData: {
					...StaffConst.AccessControlData,
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
				},
				UserId: `${RoleEnum.VISITOR} ${createUpdateVisitorFaceAuthDto.visitorDetails.visitorId.toString()}`,
				UserName: createUpdateVisitorFaceAuthDto.visitorDetails.visitorName,
				UserType: 'Normal',
			} as CreateStaffDto

			const badgeNumber = await this.createBadgeNumber(
				staffGuid,
				RoleEnum.VISITOR,
				createUpdateVisitorFaceAuthDto.visitorDetails.visitorGuid,
			)

			if (badgeNumber === null) {
				throw new OperationError('Failed to create badge number', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}

			// create user card and person
			await this.microEngineService.addUser(
				staffInfo,
				createUpdateVisitorFaceAuthDto.visitorDetails.visitorGuid,
				badgeNumber.toString(),
			)
			await this.microEngineService.sendByCardGuid()
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
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	createBadgeNumber = async (userGuid: string, role: RoleEnum, referralUid?: string) => {
		const badgeNumber = await this.cardRepository.createCardRepository({
			badgeNumber: 0,
			referralUid: referralUid ? referralUid : userGuid,
			role: role,
			status: DocumentStatusEnum.Active,
			createdBy: userGuid,
			updatedBy: userGuid,
			createdDateTime: getCurrentTimestamp(),
			updatedDateTime: getCurrentTimestamp(),
		} as Cards)
		return badgeNumber
	}
}
