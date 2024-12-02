import { OperationError } from '../common/operation-error'
import { HttpStatusCode } from '../common/http-status-code'
import { FirebaseError } from 'firebase/app'
import { convertFirebaseAuthEnumMessage } from '../common/firebase-error-code'
import {
	CreateResidentDto,
	CreateSubUserDto,
	CreateSubUserRequestDto,
	CreateStaffDto,
	EditUserDetailsByIdDto,
	GetSubUserByResidentDto,
	GetUserDetailsByIdDto,
	GetUserDto,
	GetUserByAdminDto,
} from '../dtos/user.dto'
import { Residents, SubUsers, Staffs, Users } from '../models/users.model'
import { UserRepository } from '../repositories/user.repository'
import { convertDateStringToTimestamp, convertTimestampToUserTimezone, getCurrentTimestamp } from '../helper/time'
import { FirebaseAdmin } from '../config/firebaseAdmin'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { SendGridTemplateIds, SubUserRegistrationTemplateData } from '../common/sendGrid'
import * as dotenv from 'dotenv'
import {
	DocumentStatusDescriptions,
	DocumentStatusEnum,
	GenderDescriptions,
	GenderEnum,
	PaginationDirectionEnum,
	RoleDescriptions,
	RoleEnum,
} from '../common/constants'
import { SubUserAuthTokenPayloadDto } from '../dtos/auth.dto'
import { JwtConfig } from '../config/jwtConfig'
import { FileService } from './file.service'
import { EmailService } from './email.service'
import { RefDataRepository } from '../repositories/refData.repository'
import { Unit } from '../models/refData.model'
import { NotificationRepository } from '../repositories/notification.repository'
import { GetFacilityBookingUserDto } from '../dtos/facility.dto'
import { VisitorRepository } from '../repositories/visitor.repository'
import { UserRecord } from 'firebase-admin/auth'

dotenv.config()

@provideSingleton(UserService)
export class UserService {
	private authAdmin
	constructor(
		@inject(UserRepository) private userRepository: UserRepository,
		@inject(VisitorRepository) private visitorRepository: VisitorRepository,
		@inject(RefDataRepository) private refDataRepository: RefDataRepository,
		@inject(NotificationRepository) private notificationRepository: NotificationRepository,
		@inject(FirebaseAdmin) private firebaseAdmin: FirebaseAdmin,
		@inject(FileService) private fileService: FileService,
		@inject(EmailService) private emailService: EmailService,
		@inject(JwtConfig) private jwtConfig: JwtConfig,
	) {
		this.authAdmin = this.firebaseAdmin.auth
	}

	getEffectiveUserGuidService = async (userGuid: string, role: keyof typeof RoleEnum) => {
		try {
			switch (role) {
				case 'SA':
				case 'RES':
				case 'STF':
					return userGuid
				case 'SUB':
					const subUser = await this.userRepository.getSubUserParentUserGuidByUserGuidRepository(userGuid)
					if (!subUser) {
						throw new OperationError('Sub user not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
					}
					return subUser.parentUserGuid ? subUser.parentUserGuid : ''
				case 'VI':
					const visitor = await this.visitorRepository.getVisitorDetailsRepository(userGuid)
					if (!visitor) {
						throw new OperationError('Visitor not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
					}
					return visitor.createdBy ? visitor.createdBy : ''
				default:
					throw new OperationError('Invalid role', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	createUserService = async (
		createUserDto: CreateResidentDto | CreateSubUserDto | CreateStaffDto,
		userGuid: string,
		role: keyof typeof RoleEnum,
	) => {
		try {
			if (
				!this.instanceOfCreateResidentDto(createUserDto) &&
				!this.instanceOfCreateSubUserDto(createUserDto) &&
				!this.instanceOfCreateStaffDto(createUserDto)
			) {
				throw new OperationError('Invalid request', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}

			if (role === 'SA' && this.instanceOfCreateResidentDto(createUserDto)) {
				const supportedDocuments = await this.fileService.uploadMultipleFilesService(
					createUserDto.supportedDocuments,
					`supportedDocuments/${userGuid}`,
					userGuid,
					'supported documents',
				)
				await this.userRepository.createResidentRepository(
					new Users(
						0,
						createUserDto.firstName,
						createUserDto.lastName,
						createUserDto.contactNumber,
						GenderEnum[createUserDto.gender],
						convertDateStringToTimestamp(createUserDto.dateOfBirth),
						RoleEnum[role],
						'',
						supportedDocuments ? supportedDocuments : [],
						DocumentStatusEnum.Active,
						userGuid,
						userGuid,
						getCurrentTimestamp(),
						getCurrentTimestamp(),
					),
					new Residents(
						createUserDto.floor,
						createUserDto.unit,
						userGuid,
						userGuid,
						getCurrentTimestamp(),
						getCurrentTimestamp(),
					),
					userGuid,
				)
				await this.refDataRepository.updatePropertyByResidentRepository(
					createUserDto.floor,
					createUserDto.unit,
					new Unit(true, userGuid),
				)
			}

			if (role === 'SUB' && this.instanceOfCreateSubUserDto(createUserDto)) {
				await this.userRepository.createSubUserRepository(
					new Users(
						0,
						createUserDto.firstName,
						createUserDto.lastName,
						createUserDto.contactNumber,
						GenderEnum[createUserDto.gender],
						convertDateStringToTimestamp(createUserDto.dateOfBirth),
						RoleEnum[role],
						'',
						[],
						DocumentStatusEnum.Active,
						userGuid,
						userGuid,
						getCurrentTimestamp(),
						getCurrentTimestamp(),
					),
					new SubUsers(createUserDto.parentUserGuid, userGuid, userGuid, getCurrentTimestamp(), getCurrentTimestamp()),
					userGuid,
				)
			}

			if (role === 'SA' && this.instanceOfCreateStaffDto(createUserDto)) {
				const supportedDocuments = await this.fileService.uploadMultipleFilesService(
					createUserDto.supportedDocuments,
					`supportedDocuments/${userGuid}`,
					userGuid,
					'supported documents',
				)
				await this.userRepository.createStaffRepository(
					new Users(
						0,
						createUserDto.firstName,
						createUserDto.lastName,
						createUserDto.contactNumber,
						GenderEnum[createUserDto.gender],
						convertDateStringToTimestamp(createUserDto.dateOfBirth),
						RoleEnum[role],
						'',
						supportedDocuments ? supportedDocuments : [],
						DocumentStatusEnum.Active,
						userGuid,
						userGuid,
						getCurrentTimestamp(),
						getCurrentTimestamp(),
					),
					new Staffs(createUserDto.staffId, true, userGuid, userGuid, getCurrentTimestamp(), getCurrentTimestamp()),
					userGuid,
				)
			}

			if (role === 'STF' && this.instanceOfCreateStaffDto(createUserDto)) {
				const supportedDocuments = await this.fileService.uploadMultipleFilesService(
					createUserDto.supportedDocuments,
					`supportedDocuments/${userGuid}`,
					userGuid,
					'supported files',
				)
				await this.userRepository.createStaffRepository(
					new Users(
						0,
						createUserDto.firstName,
						createUserDto.lastName,
						createUserDto.contactNumber,
						GenderEnum[createUserDto.gender],
						convertDateStringToTimestamp(createUserDto.dateOfBirth),
						RoleEnum[role],
						'',
						supportedDocuments ? supportedDocuments : [],
						DocumentStatusEnum.Active,
						userGuid,
						userGuid,
						getCurrentTimestamp(),
						getCurrentTimestamp(),
					),
					new Staffs(createUserDto.staffId, false, userGuid, userGuid, getCurrentTimestamp(), getCurrentTimestamp()),
					userGuid,
				)
			}
			await this.authAdmin.updateUser(userGuid, { displayName: createUserDto.userName })
		} catch (error: any) {
			console.log(error)
			if (error instanceof FirebaseError) {
				throw new OperationError(convertFirebaseAuthEnumMessage(error.code), HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	getUserByIdService = async (userGuid: string) => {
		try {
			const userInformation = await this.userRepository.getUserByIdRepository(userGuid)
			let data: GetUserDto = {} as GetUserDto
			data = {
				userId: userInformation.id,
				userGuid: userInformation.guid ? userInformation.guid : '',
				userName: '',
				firstName: userInformation.firstName,
				lastName: userInformation.lastName,
				gender: GenderDescriptions[userInformation.gender],
				role: RoleDescriptions[userInformation.role],
				dateOfBirth: convertTimestampToUserTimezone(userInformation.dateOfBirth),
				contactNumber: userInformation.contactNumber,
				createdBy: userInformation.createdBy,
				createdDateTime: convertTimestampToUserTimezone(userInformation.createdDateTime),
				updatedBy: userInformation.updatedBy,
				updatedDateTime: convertTimestampToUserTimezone(userInformation.updatedDateTime),
			}
			return data
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	getUserListByAdminService = async (
		isActive: boolean,
		direction: PaginationDirectionEnum,
		id: number,
		limit: number,
	) => {
		try {
			const userResult = await this.authAdmin.listUsers()
			let userList: UserRecord[] = []
			if (isActive) {
				userList = userResult.users.filter((user) => !user.disabled)
			} else {
				userList = userResult.users.filter((user) => user.disabled)
			}
			let { rows, count } = await this.userRepository.getUserListByAdminRepository(userList, direction, id, limit)
			let data: GetUserByAdminDto[] = []
			data =
				rows && rows.length > 0
					? rows.map((userInformation, index) => {
							return {
								userId: userInformation.id,
								userGuid: userInformation.guid ? userInformation.guid : '',
								userName: userList[index].displayName ? userList[index].displayName : '',
								firstName: userInformation.firstName,
								lastName: userInformation.lastName,
								gender: GenderDescriptions[userInformation.gender],
								role: RoleDescriptions[userInformation.role],
								contactNumber: userInformation.contactNumber,
								userStatus: userList[index].disabled ? 'Inactive' : 'Active',
								status: DocumentStatusDescriptions[userInformation.status],
							} as GetUserByAdminDto
					  })
					: []
			return { data, count }
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	getFacilityBookingUserService = async () => {
		try {
			const userResult = await this.authAdmin.listUsers()
			let userList: UserRecord[] = []
			userList = userResult.users.filter((user) => !user.disabled).filter((user) => user.customClaims?.role === "RES")
			let users: Users[] = await this.userRepository.getFacilityBookingUserRepository(userList)
			let data: GetFacilityBookingUserDto[] = []
			data =
				users && users.length > 0
					? users.map((userInformation, index) => {
							return {
								userGuid: userInformation.guid ? userInformation.guid : '',
								email: userList[index].email ? userList[index].email : '',
							} as GetFacilityBookingUserDto
					  })
					: []
			return data
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	getUserDetailsByIdService = async (userGuid: string) => {
		try {
			const userDetails = await this.userRepository.getUserByIdRepository(userGuid)
			let data: GetUserDetailsByIdDto = {} as GetUserDetailsByIdDto
			const userRecord: UserRecord = await this.authAdmin.getUser(userGuid)
			data = {
				userId: userDetails.id,
				userGuid: userDetails.guid ? userDetails.guid : '',
				userName: userRecord.displayName ? userRecord.displayName : '',
				firstName: userDetails.firstName,
				lastName: userDetails.lastName,
				email: userRecord.email ? userRecord.email : '',
				gender: GenderDescriptions[userDetails.gender],
				role:
					userRecord.customClaims?.role && RoleEnum[userRecord.customClaims.role as keyof typeof RoleEnum]
						? RoleDescriptions[RoleEnum[userRecord.customClaims.role as keyof typeof RoleEnum]]
						: '',
				dateOfBirth: convertTimestampToUserTimezone(userDetails.dateOfBirth),
				isActive: !userRecord.disabled,
				contactNumber: userDetails.contactNumber,
				badgeNumber: userDetails.badgeNumber,
				supportedDocuments: await this.fileService.getFilesByGuidsService(userDetails.supportedDocuments),
				status: DocumentStatusEnum[userDetails.status],
				createdBy: userDetails.createdBy,
				createdDateTime: convertTimestampToUserTimezone(userDetails.createdDateTime),
				updatedBy: userDetails.updatedBy,
				updatedDateTime: convertTimestampToUserTimezone(userDetails.updatedDateTime),
			}
			if (userDetails.role === RoleEnum.RES) {
				const residentDetails = await this.userRepository.getResidentDetailsRepository(userGuid)
				if (!residentDetails) {
					return data
				}
				data.roleInformation = {
					floor: residentDetails.floor,
					unit: residentDetails.unit,
				}
				return data
			}
			if (userDetails.role === RoleEnum.SA || userDetails.role === RoleEnum.STF) {
				const staffDetails = await this.userRepository.getStaffDetailsRepository(userGuid)
				if (!staffDetails) {
					return data
				}
				data.roleInformation = {
					staffId: staffDetails.staffId,
				}
				return data
			}
			return data
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	editUserDetailsByIdService = async (editUserDetailsByIdDto: EditUserDetailsByIdDto, userId: string) => {
		try {
			let user: Users = {
				firstName: editUserDetailsByIdDto.firstName,
				lastName: editUserDetailsByIdDto.lastName,
				contactNumber: editUserDetailsByIdDto.contactNumber,
				gender: GenderEnum[editUserDetailsByIdDto.gender],
				dateOfBirth: convertDateStringToTimestamp(editUserDetailsByIdDto.dateOfBirth),
				updatedBy: userId,
				updatedDateTime: getCurrentTimestamp(),
			} as Users
			await this.userRepository.editUserDetailsByIdRepository(userId, user)
			await this.authAdmin.updateUser(userId, { displayName: editUserDetailsByIdDto.userName })
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	activateUserByIdService = async (userId: string, updatedBy: string) => {
		try {
			const userRecord = await this.authAdmin.getUser(userId)
			if (!userRecord.disabled) {
				throw new OperationError('Users was activated before.', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			await this.authAdmin.updateUser(userId, { disabled: false })
			await this.userRepository.updateUserStatusByIdRepository(userId, {
				updatedBy: updatedBy,
				updatedDateTime: getCurrentTimestamp(),
			} as Users)
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	deactivateUserByIdService = async (userId: string, updatedBy: string) => {
		try {
			const userRecord = await this.authAdmin.getUser(userId)
			if (userRecord.disabled) {
				throw new OperationError('Users was deactivated before.', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			await this.authAdmin.updateUser(userId, { disabled: true })
			await this.userRepository.updateUserStatusByIdRepository(userId, {
				updatedBy: updatedBy,
				updatedDateTime: getCurrentTimestamp(),
			} as Users)
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	deleteUserByIdService = async (userId: string, updatedBy: string) => {
		try {
			const userRecord = await this.authAdmin.getUser(userId)
			this.authAdmin.deleteUser(userId)
			await this.userRepository.updateUserStatusByIdRepository(userId, {
				status: DocumentStatusEnum.SoftDeleted,
				updatedBy: updatedBy,
				updatedDateTime: getCurrentTimestamp(),
			} as Users)
			await this.notificationRepository.deleteNotificationTokenRepository(userId)
			if (userRecord.customClaims?.role === RoleEnum.RES) {
				const residentDetails = await this.userRepository.getResidentDetailsRepository(userId)
				if (residentDetails) {
					await this.refDataRepository.updatePropertyByResidentRepository(
						residentDetails.floor,
						residentDetails.unit,
						new Unit(false, null),
					)
				}
			}
		} catch (error: any) {
			console.log(error)
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	createSubUserRequestService = async (createSubUserRequestDto: CreateSubUserRequestDto, userId: string) => {
		try {
			const subUserRequest = await this.userRepository.getSubUserRequestByEmailRepository(createSubUserRequestDto.email)
			if (subUserRequest.length > 0) {
				throw new OperationError('Sub user request already exists', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const isEmailExist = await this.isEmailRegistered(createSubUserRequestDto.email)
			if (isEmailExist) {
				throw new OperationError('Email already exists', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const userRecord = await this.authAdmin.getUser(userId)
			const subUserRequestGuid = await this.userRepository.createSubUserRequestRepository({
				id: 0,
				email: createSubUserRequestDto.email,
				parentUserGuid: userId,
				status: DocumentStatusEnum.Pending,
				createdBy: userId,
				createdDateTime: getCurrentTimestamp(),
				updatedBy: userId,
				updatedDateTime: getCurrentTimestamp(),
			})
			const token = this.jwtConfig.createToken({
				subUserEmail: createSubUserRequestDto.email,
				parentUserGuid: userId,
				subUserRequestGuid: subUserRequestGuid,
			} as SubUserAuthTokenPayloadDto)
			if (!token) {
				throw new OperationError('Failed to generate token', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const [success, message] = await this.emailService.sendEmailService(
				createSubUserRequestDto.email,
				SendGridTemplateIds.SubUserRegistration,
				{
					inviterName: userRecord.displayName ? userRecord.displayName : '',
					registrationUrl: `${process.env.SECUREGUARDPRO_ADMIN}/sub-user/register?token=${token}`,
				} as SubUserRegistrationTemplateData,
			)
			if (!success) {
				throw new OperationError(message, HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	getSubUserListByResidentService = async (userGuid: string, id: number, limit: number) => {
		try {
			let { rows, count } = await this.userRepository.getSubUserListByResidentRepository(userGuid, id, limit)
			let data: GetSubUserByResidentDto[] = []
			data =
				rows && rows.length > 0
					? await Promise.all(
							rows.map(async (userInformation) => {
								return {
									userId: userInformation.id,
									userGuid: userInformation.guid ? userInformation.guid : '',
									userName: userInformation.guid
										? await this.authAdmin.getUser(userInformation.guid).then((user) => user.displayName)
										: '',
									firstName: userInformation.firstName,
									lastName: userInformation.lastName,
									gender: GenderDescriptions[userInformation.gender],
									dateOfBirth: convertTimestampToUserTimezone(userInformation.dateOfBirth),
									contactNumber: userInformation.contactNumber,
									status: userInformation.guid
										? await this.authAdmin.getUser(userInformation.guid).then((user) => !user.disabled)
										: false,
								} as GetSubUserByResidentDto
							}),
					  )
					: []
			return { data, count }
		} catch (error: any) {
			console.log(error)
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	getSubUserParentUserGuidByUserGuidService = async (userGuid: string) => {
		try {
			const subUser = await this.userRepository.getSubUserParentUserGuidByUserGuidRepository(userGuid)
			return subUser ? subUser.parentUserGuid : ''
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	editSubUserStatusByIdService = async (subUserGuid: string, updatedBy: string, status: boolean) => {
		try {
			await this.authAdmin.updateUser(subUserGuid, { disabled: !status })
			let subUser: SubUsers = {
				updatedBy: updatedBy,
				updatedDateTime: getCurrentTimestamp(),
			} as SubUsers
			let user: Users = {
				updatedBy: updatedBy,
				updatedDateTime: getCurrentTimestamp(),
			} as Users
			await this.userRepository.editSubUserByIdRepository(subUserGuid, subUser, user)
		} catch (error) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	deleteSubUserByIdService = async (subUserGuid: string, updatedBy: string) => {
		try {
			// can make it delete in the future for auth
			await this.authAdmin.updateUser(subUserGuid, { disabled: true })
			let subUser: SubUsers = {
				updatedBy: updatedBy,
				updatedDateTime: getCurrentTimestamp(),
			} as SubUsers
			let user: Users = {
				status: DocumentStatusEnum.SoftDeleted,
				updatedBy: updatedBy,
				updatedDateTime: getCurrentTimestamp(),
			} as Users
			await this.userRepository.editSubUserByIdRepository(subUserGuid, subUser, user)
		} catch (error) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	instanceOfCreateResidentDto = (object: any): object is CreateResidentDto => {
		return 'floor' in object && 'unit' in object
	}

	instanceOfCreateStaffDto = (object: any): object is CreateStaffDto => {
		return 'staffId' in object
	}

	instanceOfCreateSubUserDto = (object: any): object is CreateSubUserDto => {
		return 'parentUserGuid' in object
	}

	isEmailRegistered = async (email: string): Promise<boolean> => {
		try {
			// Check if the user exists by their email
			await this.authAdmin.getUserByEmail(email)
			return true // Email exists
		} catch (error: any) {
			if (error.code === 'auth/user-not-found') {
				return false // Email does not exist
			}
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}
}
