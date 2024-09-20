import { LoginDto, RegisterUserDto } from '../dtos/auth.dto'
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
} from 'tsoa'
import { IResponse } from '../dtos/index.dto'
import { HttpStatusCode } from '../common/http-status-code'
import { OperationError } from '../common/operation-error'
import { RoleEnum } from '../common/role'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { AuthService } from '../services/auth.service'

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
	public async login(@Body() loginDto: LoginDto, @Query() role: RoleEnum): Promise<IResponse<any>> {
		try {
			const token = await this.authService.loginService(loginDto, role)
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
				message: '',
				status: '500',
				data: null,
			}
			return response
		}
	}

	@Tags('Auth')
	@OperationId('checkAuth')
	@Response<IResponse<any>>('400', 'Bad Request')
	@SuccessResponse('200', 'OK')
	@Get('/check-auth')
	@Security('jwt', ['RES', 'SA'])
	public async checkAuth(): Promise<IResponse<any>> {
		try {
			const response = {
				message: 'Token valid',
				status: '200',
				data: null,
			}
			return response
		} catch (err: any) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: err.message ? err.message : '',
				status: '500',
				data: err,
			}
			return response
		}
	}
}
