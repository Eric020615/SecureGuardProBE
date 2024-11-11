import { IResponse } from '../dtos/index.dto'
import { Controller, OperationId, Response, Route, SuccessResponse, Tags, Security, Request, Get } from 'tsoa'
import { HttpStatusCode } from '../common/http-status-code'
import { MegeyeService } from '../services/megeye.service'
import { ISecurityMiddlewareRequest } from '../middleware/security.middleware'
import { OperationError } from '../common/operation-error'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { UserService } from '../services/user.service'
import { MicroEngineService } from '../services/microEngine.service'
import { CardService } from '../services/card.service'
import { GetQrCodeByUserDto } from '../dtos/card.dto'

@Route('card')
@provideSingleton(CardController)
export class CardController extends Controller {
	constructor(
		@inject(UserService) private userService: UserService,
		@inject(MegeyeService) private megeyeService: MegeyeService,
		@inject(MicroEngineService) private microEngineService: MicroEngineService,
		@inject(CardService) private cardService: CardService,
	) {
		super()
	}

	@Tags('Card')
	@OperationId('retrieveQrCode')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Get('/')
	@Security('jwt', ['SA', 'STF', 'RES', 'SUB'])
	public async getQrCodeByUser(@Request() request: ISecurityMiddlewareRequest): Promise<IResponse<GetQrCodeByUserDto>> {
		try {
			if (!request.userGuid || !request.role) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const data = await this.cardService.getQrCodeByUser(request.userGuid)
			const response = {
				message: 'Successfully retrieve qr code',
				status: '200',
				data: data,
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: 'Failed to retrieve qr code',
				status: '500',
				data: null,
			}
			return response
		}
	}
}
