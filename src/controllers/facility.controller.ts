import {
	CancelFacilityBookingDto,
	CreateFacilityBookingDto,
	GetFacilityBookingHistoryDto,
} from '../dtos/facility.dto'
import { IPaginatedResponse, IResponse } from '../dtos/index.dto'
import {
	Body,
	Controller,
	OperationId,
	Post,
	Get,
	Response,
	Route,
	SuccessResponse,
	Tags,
	Put,
	Security,
	Request,
	Query,
} from 'tsoa'
import { HttpStatusCode } from '../common/http-status-code'
import { IGetUserAuthInfoRequest } from '../middleware/security.middleware'
import { OperationError } from '../common/operation-error'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { FacilityService } from '../services/facility.service'

@Route('facility')
@provideSingleton(FacilityController)
export class FacilityController extends Controller {
	constructor(
		@inject(FacilityService)
		private facilityService: FacilityService,
	) {
		super()
	}

	@Tags('Facility')
	@OperationId('createFacilityBooking')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Post('/create')
	@Security('jwt', ['RES', 'SA'])
	public async createFacilityBooking(
		@Body() createFacilityBookingDto: CreateFacilityBookingDto,
		@Request() request: IGetUserAuthInfoRequest,
	): Promise<IResponse<any>> {
		try {
			if (!request.userId) {
				throw new OperationError('USER_NOT_FOUND', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			await this.facilityService.createFacilityBookingService(
				createFacilityBookingDto,
				request.userId,
			)
			const response = {
				message: 'Facility booking created successfully',
				status: '200',
				data: null,
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: 'Failed to create facility booking',
				status: '500',
				data: '',
			}
			return response
		}
	}

	@Tags('Facility')
	@OperationId('getFacilityBooking')
	@Response<IResponse<GetFacilityBookingHistoryDto[]>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Get('/')
	@Security('jwt', ['RES', 'SA'])
	public async getFacilityBookingHistory(
		@Request() request: IGetUserAuthInfoRequest,
		@Query() isPast: boolean,
		@Query() page: number,
		@Query() limit: number,
	): Promise<IPaginatedResponse<any>> {
		try {
			if (!request.userId) {
				throw new OperationError('USER_NOT_FOUND', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const { data, count } = await this.facilityService.getFacilityBookingService(
				request.userId,
				isPast,
				page,
				limit,
			)
			const response = {
				message: 'Facility booking retrieve successfully',
				status: '200',
				data: data,
				count: count,
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: 'Failed to retrieve facility booking',
				status: '500',
				data: null,
				count: 0,
			}
			return response
		}
	}

	@Tags('Facility')
	@OperationId('getAllFacilityBooking')
	@Response<IResponse<GetFacilityBookingHistoryDto[]>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Get('/admin')
	@Security('jwt', ['SA'])
	public async getAllFacilityBooking(): Promise<IResponse<any>> {
		try {
			const data = await this.facilityService.getAllFacilityBookingService()
			const response = {
				message: 'Facility booking retrieve successfully',
				status: '200',
				data: data,
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: 'Failed to retrieve facility booking',
				status: '500',
				data: null,
			}
			return response
		}
	}

	@Tags('Facility')
	@OperationId('cancelFacilityBooking')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Put('/cancel')
	@Security('jwt', ['SA', 'RES'])
	public async cancelFacilityBooking(
		@Request() request: IGetUserAuthInfoRequest,
		@Body() cancelFacilityBookingDto: CancelFacilityBookingDto,
	): Promise<IResponse<any>> {
		try {
			if (!request.userId) {
				throw new OperationError('USER_NOT_FOUND', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			await this.facilityService.cancelFacilityBookingService(
				request.userId,
				cancelFacilityBookingDto,
			)
			const response = {
				message: 'Facility booking cancel successfully',
				status: '200',
				data: null,
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: 'Failed to cancel facility booking',
				status: '500',
				data: null,
			}
			return response
		}
	}
}
