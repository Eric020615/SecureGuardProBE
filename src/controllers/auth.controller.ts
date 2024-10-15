import {
	AuthTokenPayloadDto,
	LoginDto,
	RegisterUserDto,
	ResetPasswordDto,
	SubUserAuthTokenPayloadDto,
} from '../dtos/auth.dto'
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
import { IResponse } from '../dtos/index.dto'
import { HttpStatusCode } from '../common/http-status-code'
import { OperationError } from '../common/operation-error'
import { RoleEnum } from '../common/role'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { AuthService } from '../services/auth.service'
import { ISecurityMiddlewareRequest } from '../middleware/security.middleware'

@Route('auth')
@provideSingleton(AuthController)
export class AuthController extends Controller {
	constructor(@inject(AuthService) private authService: AuthService) {
		super()
	}
	@Tags('Auth')
	@OperationId('registerUser')
	@Response<IResponse<any>>('400', 'Bad Request')
	@SuccessResponse('200', 'OK')
	@Post('/sign-up')
	public async signUp(
		@Body() registerUserDto: RegisterUserDto,
		@Query() role: RoleEnum,
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
			if (err instanceof OperationError) {
				const response = {
					message: err.message ? err.message : '',
					status: '500',
					data: null,
				}
				return response
			}
			const response = {
				message: '',
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
	@Post('/log-in')
	public async login(@Body() loginDto: LoginDto): Promise<IResponse<any>> {
		try {
			const token = await this.authService.loginService(loginDto)
			const response = {
				message: 'Account login successfully',
				status: '200',
				data: token,
			}
			return response
		} catch (err: any) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			if (err instanceof OperationError) {
				const response = {
					message: err.message ? err.message : '',
					status: '500',
					data: null,
				}
				return response
			}
			const response = {
				message: err,
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
	@Post('/reset-password/request')
	public async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<IResponse<any>> {
		try {
			await this.authService.sendResetPasswordEmail(resetPasswordDto)
			const response = {
				message: 'Reset password email sent successfully',
				status: '200',
				data: null,
			}
			return response
		} catch (err: any) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			if (err instanceof OperationError) {
				const response = {
					message: err.message ? err.message : '',
					status: '500',
					data: null,
				}
				return response
			}
			const response = {
				message: err,
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
	@Get('/check-auth')
	@Security('jwt', ['RES', 'SA', 'SUB'])
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
	@Get('/check-auth/sub-user')
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
