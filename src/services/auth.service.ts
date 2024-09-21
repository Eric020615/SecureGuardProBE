import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { JwtPayloadDto, LoginDto, RegisterUserDto } from '../dtos/auth.dto'
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

@provideSingleton(AuthService)
export class AuthService {
	private auth: any
	private authAdmin: any
	private firebaseClient: FirebaseClient
  
	constructor(
		@inject(UserService)
		private userService: UserService,
		@inject(FirebaseAdmin)
		private firebaseAdmin: FirebaseAdmin,
	) {
		this.firebaseClient = new FirebaseClient()
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
			await this.authAdmin.updateUser(user.uid, { disabled: true })
			const token = createToken({
				userGUID: user.uid,
				role: userRole,
			} as JwtPayloadDto)
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
				userGUID: response.user.uid,
				role: userInformation.role,
			} as JwtPayloadDto)
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
