import { IResponse } from '../dtos/index.dto'
import {
	Controller,
	OperationId,
	Response,
	Route,
	SuccessResponse,
	Tags,
	Security,
	Request,
	Get,
	Post,
	Body,
} from 'tsoa'
import { HttpStatusCode } from '../common/http-status-code'
import { ISecurityMiddlewareRequest } from '../middleware/security.middleware'
import { OperationError } from '../common/operation-error'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { CardService } from '../services/card.service'
import {
	CreateUpdateFaceAuthDto,
	CreateUpdateVisitorFaceAuthDto,
	GetCardByUserDto,
	GetQrCodeByUserDto,
} from '../dtos/card.dto'

@Route('cards')
@provideSingleton(CardController)
export class CardController extends Controller {
	constructor(@inject(CardService) private cardService: CardService) {
		super()
	}

	@Tags('Card')
	@OperationId('createCard')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Post('/')
	@Security('jwt', ['SA', 'STF', 'RES', 'SUB'])
	public async createCard(@Request() request: ISecurityMiddlewareRequest): Promise<IResponse<any>> {
		try {
			if (!request.userGuid || !request.role) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const data = await this.cardService.createCardService(request.userGuid, request.role)
			const response = {
				message: 'Successfully create card',
				status: '200',
				data: data,
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: 'Failed to create card',
				status: '500',
				data: null,
			}
			return response
		}
	}

	@Tags('Card')
	@OperationId('retrieveCard')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Get('/')
	@Security('jwt', ['SA', 'STF', 'RES', 'SUB'])
	public async getCardByUser(@Request() request: ISecurityMiddlewareRequest): Promise<IResponse<GetCardByUserDto>> {
		try {
			if (!request.userGuid || !request.role) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const data = await this.cardService.getUserCardService(request.userGuid)
			const response = {
				message: 'Successfully retrieve card',
				status: '200',
				data: data,
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: 'Failed to retrieve card',
				status: '500',
				data: null,
			}
			return response
		}
	}

	@Tags('Card')
	@OperationId('createQRCode')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Post('/qr-code')
	@Security('jwt', ['SA', 'STF', 'RES', 'SUB'])
	public async createQRCode(@Request() request: ISecurityMiddlewareRequest): Promise<IResponse<any>> {
		try {
			if (!request.userGuid || !request.role) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const data = await this.cardService.createQrCodeService(request.userGuid, request.role)
			const response = {
				message: 'Successfully create qr code',
				status: '200',
				data: data,
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: 'Failed to create qr code',
				status: '500',
				data: null,
			}
			return response
		}
	}

	@Tags('Card')
	@OperationId('retrieveQrCode')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Get('/qr-code')
	@Security('jwt', ['SA', 'STF', 'RES', 'SUB'])
	public async getQrCodeByUser(@Request() request: ISecurityMiddlewareRequest): Promise<IResponse<GetQrCodeByUserDto>> {
		try {
			if (!request.userGuid || !request.role) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const data = await this.cardService.getQrCodeByUserService(request.userGuid)
			const response = {
				message: 'Successfully retrieve qr code',
				status: '200',
				data: data,
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

	@Tags('Card')
	@OperationId('createFaceAuth')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Post('/face-auth')
	@Security('jwt', ['SA', 'STF', 'RES', 'SUB'])
	public async createFaceAuth(
		@Body() createUpdateFaceAuthDto: CreateUpdateFaceAuthDto,
		@Request() request: ISecurityMiddlewareRequest,
	): Promise<IResponse<any>> {
		try {
			if (!request.userGuid || !request.role) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			await this.cardService.createUpdateFaceAuthService(request.userGuid, request.role, createUpdateFaceAuthDto)
			const response = {
				message: 'Successfully upload user face auth',
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

	@Tags('Card')
	@OperationId('createVisitorFaceAuth')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Post('/face-auth/visitors')
	@Security('jwt', ['SA', 'STF'])
	public async createVisitorFaceAuth(
		@Body() createUpdateVisitorFaceAuthDto: CreateUpdateVisitorFaceAuthDto,
		@Request() request: ISecurityMiddlewareRequest,
	): Promise<IResponse<any>> {
		try {
			if (!request.userGuid || !request.role) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			await this.cardService.createUpdateVisitorFaceAuthService(request.userGuid, createUpdateVisitorFaceAuthDto)
			const response = {
				message: 'Successfully upload visitor face auth',
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
}
