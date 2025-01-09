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
	convertTimestampToUserTimezone,
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
import { VisitorRepository } from '../repositories/visitor.repository'
import { Visitors } from '../models/visitors.model'

@provideSingleton(CardService)
export class CardService {
	constructor(
		@inject(UserService) private userService: UserService,
		@inject(MicroEngineService) private microEngineService: MicroEngineService,
		@inject(MegeyeService)
		private megeyeService: MegeyeService,
		@inject(UserRepository) private userRepository: UserRepository,
		@inject(CardRepository) private cardRepository: CardRepository,
		@inject(VisitorRepository) private visitorRepository: VisitorRepository,
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
					Remark2: `${userData.role == 'SUB' ? `referralUserGuid: ${referralUserGuid}` : ''}`,
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
			// get effective user guid
			const referralUserGuid = await this.userService.getEffectiveUserGuidService(userGuid, role)
			await this.createOrEditMegEyePerson(userGuid, {
				recognitionType: RoleRecognitionTypeEnum[role],
				isAdmin: userData.role === 'SUB' ? true : false,
				personName: userData.firstName + ' ' + userData.lastName,
				groupList: ['1'],
				faceList: [
					{
						idx: 0,
						data: createUpdateFaceAuthDto.faceData.fileData,
					},
				],
				personCode: this.generateUserId(role, userData.userId, 'ISO14443ACSN'), // for display purpose
				phoneNum: userData.contactNumber,
				cardNumber: userData.badgeNumber,
			})
			await this.createMicroEngineUser(userGuid, role, userData.userId, userData.badgeNumber, {
				...StaffConst,
				Profile: {
					...StaffConst.Profile,
					Branch: 'HQ',
					Department: DepartmentEnum[role],
					JobTitle: JobTitleEnum[role],
					EmailAddress: userData.email,
					ContactNo: userData.contactNumber,
					Remark1: `userGuid: ${userData.userId.toString()}`,
					Remark2: `${userData.role == 'SUB' ? `referralUserGuid: ${referralUserGuid}` : ''}`,
				},
				AccessControlData: {
					...StaffConst.AccessControlData,
					AccessEntryDate: getCurrentDateString(ITimeFormat.dateTime),
					AccessExitDate: addTimeToDateString(
						getCurrentDateString(ITimeFormat.isoDateTime),
						'years',
						1,
						ITimeFormat.dateTime,
					),
				},
				UserId: this.generateUserId(role, userData.userId, 'ISO14443ACSN'),
				UserName: userData.firstName + ' ' + userData.lastName,
				UserType: 'Normal',
			} as CreateStaffDto)
		} catch (error: any) {
			throw new OperationError(error.message, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	createUpdateVisitorFaceAuthService = async (
		staffGuid: string,
		createUpdateVisitorFaceAuthDto: CreateUpdateVisitorFaceAuthDto,
	) => {
		try {
			const visitorDetails = await this.visitorRepository.getVisitorDetailsRepository(
				createUpdateVisitorFaceAuthDto.visitorGuid,
			)
			if (visitorDetails == null) {
				throw new OperationError('Visitor not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			if (!isWithinTimeRange(convertTimestampToUserTimezone(visitorDetails.visitDateTime, ITimeFormat.isoDateTime), 15)) {
				throw new OperationError(
					'You can only check in within 15 minutes before or after your visit time.',
					HttpStatusCode.FORBIDDEN,
				)
			}
			let currentDateTime = getCurrentDateStringInUTC8(ITimeFormat.isoDateTime)
			const residentGuid = await this.userService.getEffectiveUserGuidService(
				createUpdateVisitorFaceAuthDto.visitorGuid,
				'VI',
			)
			let badgeNumber = visitorDetails.badgeNumber ? visitorDetails.badgeNumber : ''
			if (badgeNumber === '') {
				const result = await this.createBadgeNumber(
					staffGuid,
					RoleEnum.VI,
					createUpdateVisitorFaceAuthDto.visitorGuid,
				)
				if (result === null) {
					throw new OperationError('Failed to create badge number', HttpStatusCode.INTERNAL_SERVER_ERROR)
				}
				badgeNumber = result.toString()
				await this.visitorRepository.editVisitorByIdRepository(
					createUpdateVisitorFaceAuthDto.visitorGuid,
					{
						badgeNumber: badgeNumber,
					} as Visitors,
				)
			}
			await this.createOrEditMegEyePerson(createUpdateVisitorFaceAuthDto.visitorGuid, {
				recognitionType: RoleRecognitionTypeEnum.VI,
				isAdmin: false,
				personName: visitorDetails.visitorName,
				groupList: ['1'],
				faceList: [
					{
						idx: 0,
						data: createUpdateVisitorFaceAuthDto.faceData.fileData,
					},
				],
				personCode: this.generateUserId('VI', visitorDetails.id, 'ISO14443ACSN'),
				phoneNum: visitorDetails.visitorContactNumber,
				cardNumber: badgeNumber,
				visitBeginTime: currentDateTime,
				visitEndTime: addTimeToDateStringInUTC8(currentDateTime, 'hours', 2, ITimeFormat.isoDateTime),
			})
			await this.createMicroEngineUser(
				createUpdateVisitorFaceAuthDto.visitorGuid,
				'VI',
				visitorDetails.id,
				badgeNumber,
				{
					...StaffConst,
					Profile: {
						...StaffConst.Profile,
						Department: DepartmentEnum.VI,
						JobTitle: JobTitleEnum.VI,
						EmailAddress: visitorDetails.visitorEmail,
						ContactNo: visitorDetails.visitorContactNumber,
						Remark1: `Resident userGuid: ${residentGuid}`,
						Remark2: `Staff PIC userGuid: ${staffGuid}`,
					},
					AccessControlData: {
						...StaffConst.AccessControlData,
						AccessEntryDate: getCurrentDateString(ITimeFormat.dateTime),
						AccessExitDate: addTimeToDateString(
							getCurrentDateString(ITimeFormat.isoDateTime),
							'hours',
							2,
							ITimeFormat.dateTime,
						),
					},
					UserId: this.generateUserId('VI', visitorDetails.id, 'ISO14443ACSN'),
					UserName: visitorDetails.visitorName,
					UserType: 'Normal',
				} as CreateStaffDto,
			)
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

	private async createOrEditMegEyePerson(
		userGuid: string,
		personData: {
			recognitionType: string
			isAdmin: boolean
			personName: string
			groupList: string[]
			faceList: { idx: number; data: string }[]
			phoneNum: string
			personCode?: string
			cardNumber?: string
			visitBeginTime?: string
			visitEndTime?: string
		},
	): Promise<void> {
		const personDetails = await this.megeyeService.queryPersonDetailsById(userGuid)
		// if exists update the access control details
		if (personDetails) {
			await this.megeyeService.editPerson(
				{
					recognition_type: personData.recognitionType,
					is_admin: personData.isAdmin,
					person_name: personData.personName,
					group_list: personData.groupList,
					face_list: personData.faceList,
					phone_num: personData.phoneNum,
				},
				userGuid,
			)
		} else {
			await this.megeyeService.createPerson({
				recognition_type: personData.recognitionType,
				id: userGuid,
				is_admin: personData.isAdmin,
				person_name: personData.personName,
				group_list: personData.groupList,
				face_list: personData.faceList,
				phone_num: personData.phoneNum,
				person_code: personData.personCode,
				card_number: personData.cardNumber,
				visit_begin_time: personData.visitBeginTime,
				visit_end_time: personData.visitEndTime,
			})
		}
	}

	private async createMicroEngineUser(
		userGuid: string,
		role: keyof typeof RoleEnum,
		userId: number,
		badgeNumber: string,
		staffInfo: CreateStaffDto,
	): Promise<void> {
		const userCard = await this.microEngineService.getUserById(this.generateUserId(role, userId, 'ISO14443ACSN'))
		if (!userCard) {
			await this.microEngineService.addUser(staffInfo, userGuid, badgeNumber)
			await this.microEngineService.sendByCardGuid()
		}
	}
}
