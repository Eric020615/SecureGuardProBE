import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { AuthTokenPayloadDto, LoginDto, RegisterUserDto } from '../dtos/auth.dto'
import { FirebaseAdmin } from '../config/firebaseAdmin'
import { FirebaseClient } from '../config/initFirebase'
import { createToken } from '../config/jwt'
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

@provideSingleton(AuthService)
export class AuthService {
	private auth: any
	private authAdmin: any

	constructor(
		@inject(UserService)
		private userService: UserService,
		@inject(FirebaseAdmin)
		private firebaseAdmin: FirebaseAdmin,
		@inject(FirebaseClient)
		private firebaseClient: FirebaseClient,
		@inject(UserRepository)
		private userRepository: UserRepository,
	) {
		this.auth = this.firebaseClient.auth
		this.authAdmin = this.firebaseAdmin.auth
	}

	registerService = async (registerUserDto: RegisterUserDto, userRole: RoleEnum) => {
		try {
			if (registerUserDto.confirmPassword !== registerUserDto.password) {
				throw new OperationError(
					'Confirm Password and Password not Match',
					HttpStatusCode.INTERNAL_SERVER_ERROR,
				)
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
				await this.userRepository.editSubUserRequestRepository(request[0].guid as string, {
					status: DocumentStatus.Active,
				} as SubUserRequest)
			}
			await this.authAdmin.setCustomUserClaims(user.uid, { role: userRole })
			const token = createToken({
				userGuid: user.uid,
				role: userRole,
			} as AuthTokenPayloadDto)
			return token
		} catch (error: any) {
			if (error instanceof FirebaseError) {
				throw new OperationError(
					convertFirebaseAuthEnumMessage(error.code),
					HttpStatusCode.INTERNAL_SERVER_ERROR,
				)
			}
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	loginService = async (loginDto: LoginDto, role: RoleEnum) => {
		try {
			const response = await signInWithEmailAndPassword(
				this.auth,
				loginDto.email,
				loginDto.password,
			)
			const user = await this.authAdmin.getUser(response.user.uid)
			if (user.disabled) {
				throw new OperationError('User Account Disabled', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const userInformation = await this.userService.GetUserByIdService(response.user.uid)
			if (userInformation.role !== role) {
				throw new OperationError('Account Login Failed', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const token = createToken({
				userGuid: response.user.uid,
				role: userInformation.role,
			} as AuthTokenPayloadDto)
			return token
		} catch (error: any) {
			if (error instanceof FirebaseError) {
				console.log(error)
				throw new OperationError(
					convertFirebaseAuthEnumMessage(error.code),
					HttpStatusCode.INTERNAL_SERVER_ERROR,
				)
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
				throw new OperationError(
					convertFirebaseAuthEnumMessage(error.code),
					HttpStatusCode.INTERNAL_SERVER_ERROR,
				)
			}
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}
}
