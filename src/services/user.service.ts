import { OperationError } from '../common/operation-error'
import { HttpStatusCode } from '../common/http-status-code'
import { FirebaseError } from 'firebase/app'
import { convertFirebaseAuthEnumMessage } from '../common/firebase-error-code'
import {
	CreateResidentDto,
	CreateSubUserDto,
	CreateSubUserRequestDto,
	CreateSystemAdminDto,
	EditUserDetailsByIdDto,
	GetUserDetailsByIdDto,
	GetUserDto,
} from '../dtos/user.dto'
import { Resident, SubUser, SubUserRequest, SystemAdmin, User } from '../models/user.model'
import { UserRepository } from '../repositories/user.repository'
import {
	convertDateStringToTimestamp,
	convertTimestampToUserTimezone,
	getNowTimestamp,
} from '../helper/time'
import { FirebaseAdmin } from '../config/firebaseAdmin'
import { RoleEnum } from '../common/role'
import { UserRecord } from 'firebase-admin/auth'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { FileService } from '../helper/file'
import { EmailService } from '../helper/email'
import { SendGridTemplateIds, SubUserRegistrationTemplateData } from '../common/sendGrid'
import { createToken } from '../config/jwt'
import * as dotenv from 'dotenv'
import { DocumentStatus } from '../common/constants'
import { SubUserAuthTokenPayloadDto } from '../dtos/auth.dto'

dotenv.config()

@provideSingleton(UserService)
export class UserService {
	private authAdmin
	constructor(
		@inject(UserRepository) private userRepository: UserRepository,
		@inject(FirebaseAdmin) private firebaseAdmin: FirebaseAdmin,
		@inject(FileService) private fileService: FileService,
		@inject(EmailService) private emailService: EmailService,
	) {
		this.authAdmin = this.firebaseAdmin.auth
	}

	createUserService = async (
		createUserDto: CreateResidentDto | CreateSubUserDto | CreateSystemAdminDto,
		userGuid: string,
		role: RoleEnum,
	) => {
		try {
			if (
				!this.instanceOfCreateResidentDto(createUserDto) &&
				!this.instanceOfCreateSubUserDto(createUserDto) &&
				!this.instanceOfCreateSystemAdminDto(createUserDto)
			) {
				throw new OperationError('Invalid request', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}

			if (role === RoleEnum.RESIDENT && this.instanceOfCreateResidentDto(createUserDto)) {
				const fileUrl = await this.fileService.uploadFile(createUserDto.supportedFiles, userGuid)
				await this.userRepository.createResidentRepository(
					new User(
						0,
						createUserDto.firstName,
						createUserDto.lastName,
						createUserDto.contactNumber,
						createUserDto.gender,
						convertDateStringToTimestamp(createUserDto.dateOfBirth),
						role,
						1,
						userGuid,
						userGuid,
						getNowTimestamp(),
						getNowTimestamp(),
					),
					new Resident(
						createUserDto.floorNumber,
						createUserDto.unitNumber,
						userGuid,
						userGuid,
						getNowTimestamp(),
						getNowTimestamp(),
						fileUrl ? fileUrl : [],
					),
					userGuid,
				)
			}

			if (role === RoleEnum.SYSTEM_ADMIN && this.instanceOfCreateSystemAdminDto(createUserDto)) {
				const fileUrl = await this.fileService.uploadFile(createUserDto.supportedFiles, userGuid)
				await this.userRepository.createSystemAdminRepository(
					new User(
						0,
						createUserDto.firstName,
						createUserDto.lastName,
						createUserDto.contactNumber,
						createUserDto.gender,
						convertDateStringToTimestamp(createUserDto.dateOfBirth),
						role,
						1,
						userGuid,
						userGuid,
						getNowTimestamp(),
						getNowTimestamp(),
					),
					new SystemAdmin(
						createUserDto.staffId,
						userGuid,
						userGuid,
						getNowTimestamp(),
						getNowTimestamp(),
						fileUrl ? fileUrl : [],
					),
					userGuid,
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
						1,
						userGuid,
						userGuid,
						getNowTimestamp(),
						getNowTimestamp(),
					),
					new SubUser(
						createUserDto.parentUserGuid,
						userGuid,
						userGuid,
						getNowTimestamp(),
						getNowTimestamp(),
					),
					userGuid,
				)
			}
			await this.authAdmin.updateUser(userGuid, { displayName: createUserDto.userName })
		} catch (error: any) {
			console.log(error)
			if (error instanceof FirebaseError) {
				throw new OperationError(
					convertFirebaseAuthEnumMessage(error.code),
					HttpStatusCode.INTERNAL_SERVER_ERROR,
				)
			}
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	GetUserByIdService = async (userGuid: string) => {
		try {
			const userInformation = await this.userRepository.GetUserByIdRepository(userGuid)
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

	GetUserListService = async (isActive: boolean, page: number, limit: number) => {
		try {
			let offset = page * limit
			const userResult = await this.authAdmin.listUsers()
			let userList: UserRecord[] = []
			if (isActive) {
				userList = userResult.users.filter((user) => !user.disabled)
			} else {
				userList = userResult.users.filter((user) => user.disabled)
			}
			let { rows, count } = await this.userRepository.GetUserListRepository(userList, offset, limit)
			let data: GetUserDto[] = []
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
								dateOfBirth: convertTimestampToUserTimezone(userInformation.dateOfBirth),
								contactNumber: userInformation.contactNumber,
								createdBy: userInformation.createdBy,
								createdDateTime: convertTimestampToUserTimezone(userInformation.createdDateTime),
								updatedBy: userInformation.updatedBy,
								updatedDateTime: convertTimestampToUserTimezone(userInformation.updatedDateTime),
							} as GetUserDto
					  })
					: []
			return { data, count }
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	GetUserDetailsByIdService = async (userGuid: string) => {
		try {
			const userDetails = await this.userRepository.GetUserByIdRepository(userGuid)
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
				role: userDetails.role,
				dateOfBirth: convertTimestampToUserTimezone(userDetails.dateOfBirth),
				isActive: !userRecord.disabled,
				contactNumber: userDetails.contactNumber,
				createdBy: userDetails.createdBy,
				createdDateTime: convertTimestampToUserTimezone(userDetails.createdDateTime),
				updatedBy: userDetails.updatedBy,
				updatedDateTime: convertTimestampToUserTimezone(userDetails.updatedDateTime),
			}
			if (userDetails.role === RoleEnum.RESIDENT) {
				const residentDetails = await this.userRepository.GetResidentDetailsRepository(userGuid)
				if (!residentDetails) {
					return data
				}
				data.roleInformation = {
					floorNumber: residentDetails.floorNumber,
					unitNumber: residentDetails.unitNumber,
					supportedFiles: residentDetails.supportedDocumentUrl,
				}
				return data
			}
			if (data.role === RoleEnum.SYSTEM_ADMIN) {
				const systemAdminDetails = await this.userRepository.GetSystemAdminDetailsRepository(
					userGuid,
				)
				if (!systemAdminDetails) {
					return data
				}
				data.roleInformation = {
					staffId: systemAdminDetails.staffId,
					supportedFiles: systemAdminDetails.supportedDocumentUrl,
				}
				return data
			}
			return null
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	editUserDetailsByIdService = async (
		editUserDetailsByIdDto: EditUserDetailsByIdDto,
		userId: string,
	) => {
		try {
			let user: User = {
				firstName: editUserDetailsByIdDto.firstName,
				lastName: editUserDetailsByIdDto.lastName,
				contactNumber: editUserDetailsByIdDto.contactNumber,
				gender: editUserDetailsByIdDto.gender,
				dateOfBirth: convertDateStringToTimestamp(editUserDetailsByIdDto.dateOfBirth),
				updatedBy: userId,
				updatedDateTime: getNowTimestamp(),
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
				updatedDateTime: getNowTimestamp(),
			} as User)
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	deactivateUserByIdService = async (userId: string, updatedBy: string) => {
		try {
			const userRecord = await this.authAdmin.getUser(userId)
			if (userRecord.disabled) {
				throw new OperationError(
					'User was deactivated before.',
					HttpStatusCode.INTERNAL_SERVER_ERROR,
				)
			}
			await this.authAdmin.updateUser(userId, { disabled: true })
			await this.userRepository.updateUserStatusByIdRepository(userId, {
				updatedBy: updatedBy,
				updatedDateTime: getNowTimestamp(),
			} as User)
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	createSubUserRequestService = async (
		createSubUserRequestDto: CreateSubUserRequestDto,
		userId: string,
	) => {
		try {
			const subUserRequest = await this.userRepository.getSubUserRequestByEmailRepository(
				createSubUserRequestDto.email,
			)
			if (subUserRequest.length > 0) {
				throw new OperationError(
					'Sub user request already exists',
					HttpStatusCode.INTERNAL_SERVER_ERROR,
				)
			}
			const isEmailExist = await this.isEmailRegistered(createSubUserRequestDto.email)
			if (isEmailExist) {
				throw new OperationError('Email already exists', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const userRecord = await this.authAdmin.getUser(userId)
			const subUserRequestGuid = await this.userRepository.createSubUserRequestRepository({
				id: 0,
				email: createSubUserRequestDto.email,
				parentUserId: userId,
				status: DocumentStatus.Pending,
				createdBy: userId,
				createdDateTime: getNowTimestamp(),
				updatedBy: userId,
				updatedDateTime: getNowTimestamp(),
			})
			const token = createToken({
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

	instanceOfCreateResidentDto = (object: any): object is CreateResidentDto => {
		return 'floorNumber' in object && 'unitNumber' in object
	}

	instanceOfCreateSystemAdminDto = (object: any): object is CreateSystemAdminDto => {
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
