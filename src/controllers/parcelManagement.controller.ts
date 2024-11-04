import { IPaginatedResponse, IResponse } from '../dtos/index.dto'
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
	Get,
	Query,
} from 'tsoa'
import { CreateParcelDto, GetParcelDto } from '../dtos/parcel.dto'
import { HttpStatusCode } from '../common/http-status-code'
import { ISecurityMiddlewareRequest } from '../middleware/security.middleware'
import { OperationError } from '../common/operation-error'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { UserService } from '../services/user.service'
import { RefDataService } from '../services/refData.service'
import { NotificationService } from '../services/notification.service'

@Route('parcels/staff')
@provideSingleton(ParcelManagementController)
export class ParcelManagementController extends Controller {
	constructor(
		@inject(ParcelService) private parcelService: ParcelService,
		@inject(UserService) private userService: UserService,
		@inject(RefDataService) private refDataService: RefDataService,
		@inject(NotificationService) private notificationService: NotificationService,
	) {
		super()
	}

	@Tags('Parcel')
	@OperationId('createParcel')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Post('/')
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
			const residentUserGuid = await this.refDataService.getUserGuidByPropertyService(
				createParcelDto.floor,
				createParcelDto.unit,
			)
			await this.notificationService.handleNotificationService(
				'Parcel Received',
				'You have received a parcel',
				{},
				residentUserGuid,
				true,
			)
			this.setStatus(HttpStatusCode.OK)
			const response = {
				message: 'Parcels created successfully',
				status: '200',
				data: null,
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			console.log(err)
			const response = {
				message: 'Failed to create parcel',
				status: '500',
				data: err,
			}
			return response
		}
	}

	@Tags('Parcel')
	@OperationId('getParcelByStaff')
	@Response<IResponse<GetParcelDto[]>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Get('/')
	@Security('jwt', ['STF'])
	public async getParcelByStaff(
		@Request() request: ISecurityMiddlewareRequest,
		@Query() id: number,
		@Query() limit: number,
	): Promise<IPaginatedResponse<GetParcelDto>> {
		try {
			if (!request.userGuid) {
				throw new OperationError('USER_NOT_FOUND', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			let { data, count } = await this.parcelService.getParcelByStaffService(id, limit, request.userGuid)
			const response = {
				message: 'Parcel retrieved successfully',
				status: '200',
				data: {
					list: data,
					count: count,
				},
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: 'Failed to retrieve parcel',
				status: '200',
				data: {
					list: null,
					count: 0,
				},
			}
			return response
		}
	}
}
