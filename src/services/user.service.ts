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
import { Resident, SubUser, Staff, User } from '../models/user.model'
import { UserRepository } from '../repositories/user.repository'
import { convertDateStringToTimestamp, convertTimestampToUserTimezone, getCurrentTimestamp } from '../helper/time'
import { FirebaseAdmin } from '../config/firebaseAdmin'
import { RoleEnum } from '../common/role'
import { UserRecord } from 'firebase-admin/auth'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { SendGridTemplateIds, SubUserRegistrationTemplateData } from '../common/sendGrid'
import * as dotenv from 'dotenv'
import { DocumentStatus, PaginationDirection } from '../common/constants'
import { SubUserAuthTokenPayloadDto } from '../dtos/auth.dto'
import { JwtConfig } from '../config/jwtConfig'
import { FileService } from './file.service'
import { EmailService } from './email.service'
import { RefDataRepository } from '../repositories/refData.repository'
import { Unit } from '../models/refData.model'
import { NotificationRepository } from '../repositories/notification.repository'
import { GetFacilityBookingUserDto } from '../dtos/facility.dto'

dotenv.config()

@provideSingleton(UserService)
export class UserService {
	private authAdmin
	constructor(
		@inject(UserRepository) private userRepository: UserRepository,
		@inject(RefDataRepository) private refDataRepository: RefDataRepository,
		@inject(NotificationRepository) private notificationRepository: NotificationRepository,
		@inject(FirebaseAdmin) private firebaseAdmin: FirebaseAdmin,
		@inject(FileService) private fileService: FileService,
		@inject(EmailService) private emailService: EmailService,
		@inject(JwtConfig) private jwtConfig: JwtConfig,
	) {
		this.authAdmin = this.firebaseAdmin.auth
	}

	getEffectiveUserGuidService = async (userGuid: string, role: RoleEnum) => {
		try {
			switch (role) {
				case RoleEnum.SYSTEM_ADMIN:
				case RoleEnum.RESIDENT:
					return userGuid
				case RoleEnum.RESIDENT_SUBUSER:
					const subUser = await this.userRepository.getSubUserParentUserGuidByUserGuidRepository(userGuid)
					if (!subUser) {
						throw new OperationError('Sub user not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
					}
					return subUser ? subUser.parentUserGuid : ''
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
		role: RoleEnum,
	) => {
		try {
			if (
				!this.instanceOfCreateResidentDto(createUserDto) &&
				!this.instanceOfCreateSubUserDto(createUserDto) &&
				!this.instanceOfCreateStaffDto(createUserDto)
			) {
				throw new OperationError('Invalid request', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}

			if (role === RoleEnum.RESIDENT && this.instanceOfCreateResidentDto(createUserDto)) {
				const supportedDocuments = await this.fileService.uploadMultipleFiles(
					createUserDto.supportedDocuments,
					`supportedDocuments/${userGuid}`,
					userGuid,
					'supported documents',
				)
				await this.userRepository.createResidentRepository(
					new User(
						0,
						createUserDto.firstName,
						createUserDto.lastName,
						createUserDto.contactNumber,
						createUserDto.gender,
						convertDateStringToTimestamp(createUserDto.dateOfBirth),
						role,
						'',
						DocumentStatus.Active,
						userGuid,
						userGuid,
						getCurrentTimestamp(),
						getCurrentTimestamp(),
					),
					new Resident(
						createUserDto.floor,
						createUserDto.unit,
						userGuid,
						userGuid,
						getCurrentTimestamp(),
						getCurrentTimestamp(),
						supportedDocuments ? supportedDocuments : [],
					),
					userGuid,
				)
				await this.refDataRepository.updatePropertyByResidentRepository(
					createUserDto.floor,
					createUserDto.unit,
					new Unit(true, userGuid),
				)
			}

			if (role === RoleEnum.RESIDENT_SUBUSER && this.instanceOfCreateSubUserDto(createUserDto)) {
				await this.userRepository.createSubUserRepository(
					new User(
						0,
						createUserDto.firstName,
						createUserDto.lastName,
						createUserDto.contactNumber,
						createUserDto.gender,
						convertDateStringToTimestamp(createUserDto.dateOfBirth),
						role,
						'',
						DocumentStatus.Active,
						userGuid,
						userGuid,
						getCurrentTimestamp(),
						getCurrentTimestamp(),
					),
					new SubUser(createUserDto.parentUserGuid, userGuid, userGuid, getCurrentTimestamp(), getCurrentTimestamp()),
					userGuid,
				)
			}

			if (role === RoleEnum.SYSTEM_ADMIN && this.instanceOfCreateStaffDto(createUserDto)) {
				const supportedDocuments = await this.fileService.uploadMultipleFiles(
					createUserDto.supportedDocuments,
					`supportedDocuments/${userGuid}`,
					userGuid,
					'supported documents',
				)
				await this.userRepository.createStaffRepository(
					new User(
						0,
						createUserDto.firstName,
						createUserDto.lastName,
						createUserDto.contactNumber,
						createUserDto.gender,
						convertDateStringToTimestamp(createUserDto.dateOfBirth),
						role,
						'',
						DocumentStatus.Active,
						userGuid,
						userGuid,
						getCurrentTimestamp(),
						getCurrentTimestamp(),
					),
					new Staff(
						createUserDto.staffId,
						true,
						userGuid,
						userGuid,
						getCurrentTimestamp(),
						getCurrentTimestamp(),
						supportedDocuments ? supportedDocuments : [],
					),
					userGuid,
				)
			}

			if (role === RoleEnum.STAFF && this.instanceOfCreateStaffDto(createUserDto)) {
				const supportedDocuments = await this.fileService.uploadMultipleFiles(
					createUserDto.supportedDocuments,
					`supportedDocuments/${userGuid}`,
					userGuid,
					'supported files',
				)
				await this.userRepository.createStaffRepository(
					new User(
						0,
						createUserDto.firstName,
						createUserDto.lastName,
						createUserDto.contactNumber,
						createUserDto.gender,
						convertDateStringToTimestamp(createUserDto.dateOfBirth),
						role,
						'',
						DocumentStatus.Active,
						userGuid,
						userGuid,
						getCurrentTimestamp(),
						getCurrentTimestamp(),
					),
					new Staff(
						createUserDto.staffId,
						false,
						userGuid,
						userGuid,
						getCurrentTimestamp(),
						getCurrentTimestamp(),
						supportedDocuments ? supportedDocuments : [],
					),
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
				gender: userInformation.gender,
				role: userInformation.role,
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

	getUserListByAdminService = async (isActive: boolean, direction: PaginationDirection, id: number, limit: number) => {
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
								gender: userInformation.gender,
								role: userInformation.role,
								contactNumber: userInformation.contactNumber,
								userStatus: userList[index].disabled ? 'Inactive' : 'Active',
								status: DocumentStatus[userInformation.status],
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
			userList = userResult.users
				.filter((user) => !user.disabled)
				.filter((user) => user.customClaims?.role === RoleEnum.RESIDENT)
			let users: User[] = await this.userRepository.getFacilityBookingUserRepository(userList)
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
			const userRecord = await this.authAdmin.getUser(userGuid)
			data = {
				userId: userDetails.id,
				userGuid: userDetails.guid ? userDetails.guid : '',
				userName: userRecord.displayName ? userRecord.displayName : '',
				firstName: userDetails.firstName,
				lastName: userDetails.lastName,
				email: userRecord.email ? userRecord.email : '',
				gender: userDetails.gender,
				role: userRecord.customClaims?.role ? userRecord.customClaims.role : '',
				dateOfBirth: convertTimestampToUserTimezone(userDetails.dateOfBirth),
				isActive: !userRecord.disabled,
				contactNumber: userDetails.contactNumber,
				badgeNumber: userDetails.badgeNumber,
				status: DocumentStatus[userDetails.status],
				createdBy: userDetails.createdBy,
				createdDateTime: convertTimestampToUserTimezone(userDetails.createdDateTime),
				updatedBy: userDetails.updatedBy,
				updatedDateTime: convertTimestampToUserTimezone(userDetails.updatedDateTime),
			}
			if (userDetails.role === RoleEnum.RESIDENT) {
				const residentDetails = await this.userRepository.getResidentDetailsRepository(userGuid)
				if (!residentDetails) {
					return data
				}
				data.roleInformation = {
					floor: residentDetails.floor,
					unit: residentDetails.unit,
					supportedDocuments: await this.fileService.getFilesByGuidsService(residentDetails.supportedDocuments),
				}
				return data
			}
			if (data.role === RoleEnum.SYSTEM_ADMIN || data.role === RoleEnum.STAFF) {
				const staffDetails = await this.userRepository.getStaffDetailsRepository(userGuid)
				if (!staffDetails) {
					return data
				}
				data.roleInformation = {
					staffId: staffDetails.staffId,
					supportedDocuments: await this.fileService.getFilesByGuidsService(staffDetails.supportedDocuments),
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
			let user: User = {
				firstName: editUserDetailsByIdDto.firstName,
				lastName: editUserDetailsByIdDto.lastName,
				contactNumber: editUserDetailsByIdDto.contactNumber,
				gender: editUserDetailsByIdDto.gender,
				dateOfBirth: convertDateStringToTimestamp(editUserDetailsByIdDto.dateOfBirth),
				updatedBy: userId,
				updatedDateTime: getCurrentTimestamp(),
			} as User
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
				throw new OperationError('User was activated before.', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			await this.authAdmin.updateUser(userId, { disabled: false })
			await this.userRepository.updateUserStatusByIdRepository(userId, {
				updatedBy: updatedBy,
				updatedDateTime: getCurrentTimestamp(),
			} as User)
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	deactivateUserByIdService = async (userId: string, updatedBy: string) => {
		try {
			const userRecord = await this.authAdmin.getUser(userId)
			if (userRecord.disabled) {
				throw new OperationError('User was deactivated before.', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			await this.authAdmin.updateUser(userId, { disabled: true })
			await this.userRepository.updateUserStatusByIdRepository(userId, {
				updatedBy: updatedBy,
				updatedDateTime: getCurrentTimestamp(),
			} as User)
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	deleteUserByIdService = async (userId: string, updatedBy: string) => {
		try {
			const userRecord = await this.authAdmin.getUser(userId)
			this.authAdmin.deleteUser(userId)
			await this.userRepository.updateUserStatusByIdRepository(userId, {
				status: DocumentStatus.SoftDeleted,
				updatedBy: updatedBy,
				updatedDateTime: getCurrentTimestamp(),
			} as User)
			await this.notificationRepository.deleteNotificationTokenRepository(userId)
			if (userRecord.customClaims?.role === RoleEnum.RESIDENT) {
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
				status: DocumentStatus.Pending,
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
			const [success, message] = await this.emailService.sendEmail(
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
									gender: userInformation.gender,
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
			let subUser: SubUser = {
				updatedBy: updatedBy,
				updatedDateTime: getCurrentTimestamp(),
			} as SubUser
			let user: User = {
				updatedBy: updatedBy,
				updatedDateTime: getCurrentTimestamp(),
			} as User
			await this.userRepository.editSubUserByIdRepository(subUserGuid, subUser, user)
		} catch (error) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	deleteSubUserByIdService = async (subUserGuid: string, updatedBy: string) => {
		try {
			// can make it delete in the future for auth
			await this.authAdmin.updateUser(subUserGuid, { disabled: true })
			let subUser: SubUser = {
				updatedBy: updatedBy,
				updatedDateTime: getCurrentTimestamp(),
			} as SubUser
			let user: User = {
				status: DocumentStatus.SoftDeleted,
				updatedBy: updatedBy,
				updatedDateTime: getCurrentTimestamp(),
			} as User
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
				return false // Email does not exist, proceed
			}
			// Handle other errors that might occur
			throw error // Rethrow unexpected errors
		}
	}
}
