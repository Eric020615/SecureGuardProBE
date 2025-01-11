import {
	AuthTokenPayloadDto,
	LoginDto,
	RegisterUserDto,
	RequestResetPasswordDto,
	ResetPasswordDto,
	SubUserAuthTokenPayloadDto,
} from '../dto/auth.dto'
import {
	Controller,
	Route,
	Post,
	Tags,
	OperationId,
	Response,
	SuccessResponse,
	Body,
	Security,
	Get,
	Query,
	Request,
} from 'tsoa'
import { IResponse } from '../dto/index.dto'
import { HttpStatusCode } from '../common/http-status-code'
import { OperationError } from '../common/operation-error'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { AuthService } from '../service/auth.service'
import { ISecurityMiddlewareRequest } from '../middleware/security.middleware'
import { NotificationService } from '../service/notification.service'
import { RoleEnum } from '../common/constants'

@Route('auth')
@provideSingleton(AuthController)
export class AuthController extends Controller {
	constructor(@inject(AuthService) private authService: AuthService, @inject(NotificationService) private notificationService: NotificationService) {
		super()
	}
	@Tags('Auth')
	@OperationId('registerUser')
	@Response<IResponse<any>>('400', 'Bad Request')
	@SuccessResponse('200', 'OK')
	@Post('/signup')
	public async signUp(
		@Body() registerUserDto: RegisterUserDto,
		@Query() role: keyof typeof RoleEnum,
	): Promise<IResponse<any>> {
		try {
			const token = await this.authService.registerService(registerUserDto, role)
			const response = {
				message: 'Account Created successfully',
				status: '200',
				data: token,
			}
			return response
		} catch (err: any) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: err.message ? err.message : '',
				status: '500',
				data: null,
			}
			return response
		}
	}

	@Tags('Auth')
	@OperationId('login')
	@Response<IResponse<any>>('400', 'Bad Request')
	@SuccessResponse('200', 'OK')
	@Post('/login')
	public async login(@Body() loginDto: LoginDto): Promise<IResponse<any>> {
		try {
			const { token, userGuid } = await this.authService.loginService(loginDto)
			if(loginDto.notificationToken && userGuid) {
				await this.notificationService.createNotificationTokenService(loginDto.notificationToken, userGuid)
			}
			const response = {
				message: 'Account login successfully',
				status: '200',
				data: token,
			}
			return response
		} catch (err: any) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: err.message ? err.message : '',
				status: '500',
				data: null,
			}
			return response
		}
	}

	@Tags('Auth')
	@OperationId('Forgot Password')
	@Response<IResponse<any>>('400', 'Bad Request')
	@SuccessResponse('200', 'OK')
	@Post('/reset-password/request')
	public async requestResetPassword(
		@Body() requestResetPasswordDto: RequestResetPasswordDto,
	): Promise<IResponse<any>> {
		try {
			await this.authService.sendResetPasswordEmail(requestResetPasswordDto)
			const response = {
				message: 'Reset password email sent successfully',
				status: '200',
				data: null,
			}
			return response
		} catch (err: any) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: err.message ? err.message : '',
				status: '500',
				data: null,
			}
			return response
		}
	}

	@Tags('Auth')
	@OperationId('Reset Password')
	@Response<IResponse<any>>('400', 'Bad Request')
	@SuccessResponse('200', 'OK')
	@Post('/reset-password')
	@Security('jwt', ['RES', 'SA', 'STF', 'SUB'])
	public async resetPassword(
		@Body() resetPasswordDto: ResetPasswordDto,
		@Request() request: ISecurityMiddlewareRequest,
	): Promise<IResponse<any>> {
		try {
			if (!request.userGuid || !request.role) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			await this.authService.resetPasswordService(resetPasswordDto, request.userGuid)
			const response = {
				message: 'Password reset successfully',
				status: '200',
				data: null,
			}
			return response
		} catch (err: any) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: err.message ? err.message : '',
				status: '500',
				data: null,
			}
			return response
		}
	}

	@Tags('Auth')
	@OperationId('checkAuth')
	@Response<IResponse<AuthTokenPayloadDto>>('400', 'Bad Request')
	@SuccessResponse('200', 'OK')
	@Get('/check')
	@Security('jwt', ['RES', 'SA', 'STF', 'SUB'])
	public async checkAuth(
		@Request() request: ISecurityMiddlewareRequest,
		@Query() check?: boolean,
	): Promise<IResponse<AuthTokenPayloadDto>> {
		try {
			const response = {
				message: 'Token valid',
				status: '200',
				data: {
					userGuid: request.userGuid,
					role: request.role,
				} as AuthTokenPayloadDto,
			}
			return response
		} catch (err: any) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: err.message ? err.message : '',
				status: '500',
				data: null,
			}
			return response
		}
	}

	@Tags('Auth')
	@OperationId('checkSubUserAuth')
	@Response<IResponse<any>>('400', 'Bad Request')
	@SuccessResponse('200', 'OK')
	@Get('/check/sub-user')
	@Security('subUserAuth', [])
	public async checkSubUserAuth(
		@Request() request: ISecurityMiddlewareRequest,
	): Promise<IResponse<SubUserAuthTokenPayloadDto>> {
		try {
			const response = {
				message: 'Token valid',
				status: '200',
				data: {
					subUserRequestGuid: request.subUserRequestGuid,
					subUserEmail: request.subUserEmail,
					parentUserGuid: request.parentUserGuid,
				} as SubUserAuthTokenPayloadDto,
			}
			return response
		} catch (err: any) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: err.message ? err.message : '',
				status: '500',
				data: null,
			}
			return response
		}
	}
}
