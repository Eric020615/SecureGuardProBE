import { IResponse } from '../dtos/index.dto'
import { ParcelService } from '../services/parcel.service'
import {
	Body,
	Controller,
	OperationId,
	Post,
	Response,
	Route,
	SuccessResponse,
	Tags,
	Security,
	Request,
} from 'tsoa'
import { CreateParcelDto } from '../dtos/parcel.dto'
import { HttpStatusCode } from '../common/http-status-code'
import { ISecurityMiddlewareRequest } from '../middleware/security.middleware'
import { OperationError } from '../common/operation-error'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'

@Route('parcel')
@provideSingleton(ParcelController)
export class ParcelController extends Controller {
	constructor(@inject(ParcelService) private parcelService: ParcelService) {
		super()
	}

	@Tags('Parcel')
	@OperationId('createParcel')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Post('/create')
	@Security('jwt', ['STF'])
	public async createParcel(
		@Body() createParcelDto: CreateParcelDto,
		@Request() request: ISecurityMiddlewareRequest,
	): Promise<IResponse<any>> {
		try {
			if (!request.userGuid) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			await this.parcelService.createParcelService(createParcelDto, request.userGuid)
			this.setStatus(HttpStatusCode.OK)
			const response = {
				message: 'Parcels created successfully',
				status: '200',
				data: null,
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: 'Failed to create parcel',
				status: '500',
				data: err,
			}
			return response
		}
	}
}
