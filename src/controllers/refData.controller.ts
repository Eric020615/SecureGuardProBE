import { IResponse } from '../dtos/index.dto'
import {
	Controller,
	OperationId,
	Get,
	Response,
	Route,
	SuccessResponse,
	Tags,
	Security,
	Request,
	Query,
} from 'tsoa'
import { HttpStatusCode } from '../common/http-status-code'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { RefDataService } from '../services/refData.service'
import { GetPropertyListDto } from '../dtos/refData.dto'

@Route('ref-data')
@provideSingleton(RefDataController)
export class RefDataController extends Controller {
	constructor(
		@inject(RefDataService)
		private refDataService: RefDataService,
	) {
		super()
	}

	@Tags('RefData')
	@OperationId('getPropertyList')
	@Response<IResponse<GetPropertyListDto[]>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Get('/properties')
	public async getPropertyList(
		@Query() checkOccupied: boolean,
	): Promise<IResponse<GetPropertyListDto[]>> {
		try {
			const data = await this.refDataService.getPropertyListService(checkOccupied)
			const response = {
				message: 'Property list retrieve successfully',
				status: '200',
				data: data
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
            const response = {
				message: 'Failed to retrieve property list',
				status: '500',
				data: null
			}
			return response
		}
	}
}
