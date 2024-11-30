import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import {
	AuthTokenPayloadDto,
	LoginDto,
	RegisterUserDto,
	RequestResetPasswordDto,
	ResetPasswordDto,
} from '../dtos/auth.dto'
import { FirebaseAdmin } from '../config/firebaseAdmin'
import { FirebaseClient } from '../config/initFirebase'
import { OperationError } from '../common/operation-error'
import { HttpStatusCode } from '../common/http-status-code'
import { FirebaseError } from 'firebase/app'
import { convertFirebaseAuthEnumMessage } from '../common/firebase-error-code'
import { RoleEnum } from '../common/role'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { UserService } from './user.service'
import { UserRepository } from '../repositories/user.repository'
import { DocumentStatus } from '../common/constants'
import { SubUserRequest } from '../models/user.model'
import { PasswordResetTemplateData, SendGridTemplateIds } from '../common/sendGrid'
import { UserRecord } from 'firebase-admin/auth'
import { JwtConfig } from '../config/jwtConfig'
import { EmailService } from './email.service'
import { CardRepository } from '../repositories/card.repository'
import { Card } from '../models/card.model'
import { getCurrentTimestamp } from '../helper/time'

@provideSingleton(AuthService)
export class AuthService {
	private auth: any
	private authAdmin: any

	constructor(
		@inject(UserService)
		private userService: UserService,
		@inject(EmailService)
		private emailService: EmailService,
		@inject(FirebaseAdmin)
		private firebaseAdmin: FirebaseAdmin,
		@inject(FirebaseClient)
		private firebaseClient: FirebaseClient,
		@inject(UserRepository)
		private userRepository: UserRepository,
		@inject(CardRepository)
		private cardRepository: CardRepository,
		@inject(JwtConfig)
		private jwtConfig: JwtConfig,
	) {
		this.auth = this.firebaseClient.auth
		this.authAdmin = this.firebaseAdmin.auth
	}

	registerService = async (registerUserDto: RegisterUserDto, userRole: RoleEnum) => {
		try {
			if (registerUserDto.confirmPassword !== registerUserDto.password) {
				throw new OperationError('Confirm Password and Password not Match', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const userCredentials = await createUserWithEmailAndPassword(
				this.auth,
				registerUserDto.email,
				registerUserDto.password,
			)
			const user = userCredentials.user
			if (userRole != RoleEnum.RESIDENT_SUBUSER) {
				await this.authAdmin.updateUser(user.uid, { disabled: true })
			}
			if (userRole === RoleEnum.RESIDENT_SUBUSER) {
				const request = await this.userRepository.getSubUserRequestByEmailRepository(registerUserDto.email)
				await this.userRepository.editSubUserRequestRepository(
					request[0].guid as string,
					{
						status: DocumentStatus.Active,
					} as SubUserRequest,
				)
			}
			await this.authAdmin.setCustomUserClaims(user.uid, { role: userRole })
			const token = this.jwtConfig.createToken({
				userGuid: user.uid,
				role: userRole,
			} as AuthTokenPayloadDto)
			return token
		} catch (error: any) {
			if (error instanceof FirebaseError) {
				throw new OperationError(convertFirebaseAuthEnumMessage(error.code), HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	loginService = async (loginDto: LoginDto) => {
		try {
			const response = await signInWithEmailAndPassword(this.auth, loginDto.email, loginDto.password)
			const user = await this.authAdmin.getUser(response.user.uid)
			const role = user.customClaims?.role || ''
			if (user.disabled) {
				throw new OperationError('User Account Disabled', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const token = this.jwtConfig.createToken({
				userGuid: response.user.uid,
				role: role,
			} as AuthTokenPayloadDto)
			return { token, userGuid: response.user.uid }
		} catch (error: any) {
			if (error instanceof FirebaseError) {
				console.log(error)
				throw new OperationError(convertFirebaseAuthEnumMessage(error.code), HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			throw new OperationError('Account Login Failed', HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	checkUserStatus = async (userId: string) => {
		try {
			const user = await this.authAdmin.getUser(userId)
			if (!user) {
				throw new OperationError('User Not Found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			if (user.disabled) {
				throw new OperationError('User Account Disabled', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
		} catch (error: any) {
			if (error instanceof FirebaseError) {
				throw new OperationError(convertFirebaseAuthEnumMessage(error.code), HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	sendResetPasswordEmail = async (requestResetPasswordDto: RequestResetPasswordDto) => {
		try {
			const isEmailExist = await this.userService.isEmailRegistered(requestResetPasswordDto.email)
			if (!isEmailExist) {
				throw new OperationError('Email not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const link = await this.authAdmin.generatePasswordResetLink(requestResetPasswordDto.email)
			if (!link) {
				throw new OperationError('Failed to send reset password email', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const [success, message] = await this.emailService.sendEmailService(
				requestResetPasswordDto.email,
				SendGridTemplateIds.PasswordReset,
				{
					resetPasswordUrl: link,
				} as PasswordResetTemplateData,
			)
			if (!success) {
				throw new OperationError(message, HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
		} catch (error) {
			if (error instanceof FirebaseError) {
				throw new OperationError(convertFirebaseAuthEnumMessage(error.code), HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	resetPasswordService = async (resetPasswordDto: ResetPasswordDto, userGuid: string) => {
		try {
			const user: UserRecord = await this.authAdmin.getUser(userGuid)
			await signInWithEmailAndPassword(this.auth, user.email as string, resetPasswordDto.currentPassword) // Sign in the user with the current password
			if (resetPasswordDto.currentPassword === resetPasswordDto.newPassword) {
				throw new OperationError(
					'New password cannot be the same as the current password',
					HttpStatusCode.INTERNAL_SERVER_ERROR,
				)
			}
			await this.authAdmin.updateUser(userGuid, { password: resetPasswordDto.newPassword }) // Update the user's password
		} catch (error: any) {
			if (error instanceof FirebaseError) {
				throw new OperationError(convertFirebaseAuthEnumMessage(error.code), HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}
}
