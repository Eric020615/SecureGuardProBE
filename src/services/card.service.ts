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
import {
	DepartmentEnum,
	DocumentStatusEnum,
	ITimeFormat,
	JobTitleEnum,
	RoleEnum,
	RoleRecognitionTypeEnum,
	StaffConst,
} from '../common/constants'
import { CreateStaffDto } from '../dtos/microengine.dto'
import {
	addTimeToDateString,
	addTimeToDateStringInUTC8,
	getCurrentDateString,
	getCurrentDateStringInUTC8,
	getCurrentTimestamp,
	isWithinTimeRange,
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
	createCardService = async (userGuid: string, role: keyof typeof RoleEnum) => {
		try {
			const userData = await this.userService.getUserDetailsByIdService(userGuid)
			if (userData.badgeNumber !== '') {
				throw new Error('User card already exists')
			}
			const badgeNumber = await this.createBadgeNumber(userGuid, RoleEnum[role])
			await this.userRepository.editUserDetailsByIdRepository(userGuid, {
				badgeNumber: badgeNumber.toString(),
			} as Users)
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

	createQrCodeService = async (userGuid: string, role: keyof typeof RoleEnum) => {
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
					Department: DepartmentEnum[role],
					JobTitle: JobTitleEnum[role],
					EmailAddress: userData.email,
					ContactNo: userData.contactNumber,
					Remark1: `userGuid: ${userData.userId.toString()}`,
					Remark2: `referralUserGuid ${userData.role == 'SUB' ? referralUserGuid : ''}`,
				},
				AccessControlData: {
					...StaffConst.AccessControlData,
					AccessEntryDate: getCurrentDateString(ITimeFormat.dateTime),
					AccessExitDate: addTimeToDateString(getCurrentDateString(ITimeFormat.date), 'years', 1, ITimeFormat.dateTime),
				},
				UserId: this.generateUserId(role, userData.userId, 'QRCode'),
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
				this.generateUserId(userData.role, userData.userId, 'QRCode'),
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

	createUpdateFaceAuthService = async (
		userGuid: string,
		role: keyof typeof RoleEnum,
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
			let currentDateTime = getCurrentDateStringInUTC8(ITimeFormat.isoDateTime)

			// get effective user guid
			const effectiveUserGuid = await this.userService.getEffectiveUserGuidService(userGuid, role)

			// query user card and person details
			const userCard = await this.microEngineService.getUserById(
				this.generateUserId(role, userData.userId, 'ISO14443ACSN'),
			)
			const personDetails = await this.megeyeService.queryPersonDetailsById(effectiveUserGuid)

			// if exists update the access control details
			if (userCard && personDetails) {
				await this.megeyeService.editPerson(
					{
						recognition_type: RoleRecognitionTypeEnum[role],
						is_admin: userData.role === 'SA' ? true : false,
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
					...StaffConst.Profile,
					Branch: 'HQ',
					Department: DepartmentEnum[role],
					JobTitle: JobTitleEnum[role],
					EmailAddress: userData.email,
					ContactNo: userData.contactNumber,
				},
				AccessControlData: {
					...StaffConst.AccessControlData,
					AccessEntryDate: currentDateTime,
					AccessExitDate: addTimeToDateStringInUTC8(currentDateTime, 'years', 1, ITimeFormat.isoDateTime),
				},
				UserId: this.generateUserId(role, userData.userId, 'ISO14443ACSN'),
				UserName: userData.firstName + ' ' + userData.lastName,
				UserType: 'Normal',
			} as CreateStaffDto

			await this.megeyeService.createPerson({
				recognition_type: RoleRecognitionTypeEnum[role],
				id: effectiveUserGuid,
				is_admin: userData.role === 'SUB' ? true : false,
				person_name: userData.firstName + ' ' + userData.lastName,
				group_list: ['1'],
				face_list: [
					{
						idx: 0,
						data: createUpdateFaceAuthDto.faceData.fileData,
					},
				],
				person_code: this.generateUserId(role, userData.userId, 'ISO14443ACSN'), // for display purpose
				phone_num: userData.contactNumber,
				card_number: userData.badgeNumber,
			})
			// create user card and person
			await this.microEngineService.addUser(staffInfo, userGuid, userData.badgeNumber)
			await this.microEngineService.sendByCardGuid()
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	createUpdateVisitorFaceAuthService = async (
		staffGuid: string,
		createUpdateVisitorFaceAuthDto: CreateUpdateVisitorFaceAuthDto,
	) => {
		try {
			if (!isWithinTimeRange(createUpdateVisitorFaceAuthDto.visitorDetails.visitDateTime, 15)) {
				throw new OperationError(
					'You can only check in within 15 minutes before or after your visit time.',
					HttpStatusCode.FORBIDDEN,
				)
			}
			let currentDateTime = getCurrentDateStringInUTC8(ITimeFormat.isoDateTime)
			// get resident guid
			const residentGuid = await this.userService.getEffectiveUserGuidService(
				createUpdateVisitorFaceAuthDto.visitorDetails.visitorGuid,
				'VI',
			)

			// query user card and person details
			const userCard = await this.microEngineService.getUserById(
				this.generateUserId('VI', createUpdateVisitorFaceAuthDto.visitorDetails.visitorId, 'ISO14443ACSN'),
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

			const badgeNumber = await this.createBadgeNumber(
				staffGuid,
				RoleEnum.VI,
				createUpdateVisitorFaceAuthDto.visitorDetails.visitorGuid,
			)

			if (badgeNumber === null) {
				throw new OperationError('Failed to create badge number', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}

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
				person_code: this.generateUserId('VI', createUpdateVisitorFaceAuthDto.visitorDetails.visitorId, 'ISO14443ACSN'),
				phone_num: createUpdateVisitorFaceAuthDto.visitorDetails.visitorContactNumber,
				card_number: badgeNumber.toString(),
				visit_begin_time: currentDateTime,
				visit_end_time: addTimeToDateStringInUTC8(currentDateTime, 'hours', 2, ITimeFormat.isoDateTime),
			})

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
					AccessEntryDate: currentDateTime,
					AccessExitDate: addTimeToDateStringInUTC8(currentDateTime, 'hours', 2, ITimeFormat.isoDateTime),
				},
				UserId: this.generateUserId('VI', createUpdateVisitorFaceAuthDto.visitorDetails.visitorId, 'ISO14443ACSN'),
				UserName: createUpdateVisitorFaceAuthDto.visitorDetails.visitorName,
				UserType: 'Normal',
			} as CreateStaffDto
			// create user card and person
			await this.microEngineService.addUser(
				staffInfo,
				createUpdateVisitorFaceAuthDto.visitorDetails.visitorGuid,
				badgeNumber.toString(),
			)
			await this.microEngineService.sendByCardGuid()
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	createBadgeNumber = async (userGuid: string, role: RoleEnum, referralUid?: string) => {
		const badgeNumber = await this.cardRepository.createCardRepository({
			badgeNumber: 0,
			referralUid: referralUid ? referralUid : userGuid,
			role: role,
			status: DocumentStatusEnum.ACTIVE,
			createdBy: userGuid,
			updatedBy: userGuid,
			createdDateTime: getCurrentTimestamp(),
			updatedDateTime: getCurrentTimestamp(),
		} as Cards)
		return badgeNumber
	}

	generateUserId = (
		role: keyof typeof RoleEnum,
		userId: number,
		accessType: 'MifareSector' | 'QRCode' | 'ISO14443ACSN',
	): string => {
		if (!Object.keys(RoleEnum).includes(role)) {
			throw new Error('Invalid role. Role must be a valid key from RoleEnum and in uppercase letters.')
		}
		if (!Number.isInteger(userId) || userId <= 0) {
			throw new Error('UserId must be a positive integer.')
		}
		const accessTypeLabels: Record<typeof accessType, string> = {
			QRCode: 'QR',
			ISO14443ACSN: 'FR',
			MifareSector: 'Card',
		}

		const friendlyAccessType = accessTypeLabels[accessType] || 'unknown'
		return `${role} ${userId} ${friendlyAccessType}`
	}
}
