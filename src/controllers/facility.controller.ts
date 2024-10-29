import {
	CancelFacilityBookingDto,
	CreateFacilityBookingDto,
	GetFacilityBookingDetailsDto,
	GetFacilityBookingHistoryDto,
	SpaceAvailabilityDto,
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
import { ISecurityMiddlewareRequest } from '../middleware/security.middleware'
import { OperationError } from '../common/operation-error'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { FacilityService } from '../services/facility.service'
import { UserService } from '../services/user.service'
import { PaginationDirection } from '../common/constants'

@Route('facility')
@provideSingleton(FacilityController)
export class FacilityController extends Controller {
	constructor(
		@inject(FacilityService)
		private facilityService: FacilityService,
		@inject(UserService)
		private userService: UserService,
	) {
		super()
	}

	@Tags('Facility')
	@OperationId('createFacilityBooking')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Post('/create')
	@Security('jwt', ['RES', 'SUB', 'SA'])
	public async createFacilityBooking(
		@Body() createFacilityBookingDto: CreateFacilityBookingDto,
		@Request() request: ISecurityMiddlewareRequest,
	): Promise<IResponse<any>> {
		try {
			if (!request.userGuid) {
				throw new OperationError('USER_NOT_FOUND', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const userGuid = await this.userService.getEffectiveUserGuidService(request.userGuid, request.role)
			await this.facilityService.createFacilityBookingService(createFacilityBookingDto, userGuid)
			const response = {
				message: 'Facility booking created successfully',
				status: '200',
				data: null,
			}
			return response
		} catch (err) {
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

	@Tags('Facility')
	@OperationId('getFacilityBooking')
	@Response<IResponse<GetFacilityBookingHistoryDto[]>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Get('/')
	@Security('jwt', ['RES', 'SA', 'SUB'])
	public async getFacilityBookingHistory(
		@Request() request: ISecurityMiddlewareRequest,
		@Query() isPast: boolean,
		@Query() id: number,
		@Query() limit: number,
	): Promise<IPaginatedResponse<GetFacilityBookingHistoryDto>> {
		try {
			if (!request.userGuid) {
				throw new OperationError('USER_NOT_FOUND', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const userGuid = await this.userService.getEffectiveUserGuidService(request.userGuid, request.role)
			const { data, count } = await this.facilityService.getFacilityBookingService(userGuid, isPast, id, limit)
			const response = {
				message: 'Facility booking retrieve successfully',
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
				message: 'Failed to retrieve facility booking',
				status: '500',
				data: {
					list: null,
					count: 0,
				},
			}
			return response
		}
	}

	@Tags('Facility')
	@OperationId('getFacilityBookingHistoryByAdmin')
	@Response<IResponse<GetFacilityBookingHistoryDto[]>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Get('/admin')
	@Security('jwt', ['SA'])
	public async getFacilityBookingHistoryByAdmin (
		@Query() direction: PaginationDirection.Next | PaginationDirection.Previous,
		@Query() id: number,
		@Query() limit: number,
	): Promise<IPaginatedResponse<GetFacilityBookingHistoryDto>> {
		try {
			const { data, count } = await this.facilityService.getFacilityBookingHistoryByAdminService(direction, id, limit)
			const response = {
				message: 'Facility booking retrieve successfully',
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
				message: 'Failed to retrieve facility booking',
				status: '500',
				data: {
					list: null,
					count: 0,
				},
			}
			return response
		}
	}

	@Tags('Facility')
	@OperationId('getFacilityBookingDetails')
	@Response<IResponse<GetFacilityBookingHistoryDto>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Get('/details')
	@Security('jwt', ['RES', 'SUB', 'SA'])
	public async getFacilityBookingDetailsByFacilityGuid (
		@Query() facilityBookingGuid: string,
	): Promise<IResponse<GetFacilityBookingDetailsDto>> {
		try {
			const data = await this.facilityService.getFacilityBookingDetailsByFacilityBookingGuidService(facilityBookingGuid)
			const response = {
				message: 'Facility booking details retrieve successfully',
				status: '200',
				data: data
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: 'Failed to retrieve facility booking details',
				status: '500',
				data: null
			}
			return response
		}
	}

	@Tags('Facility')
	@OperationId('cancelFacilityBooking')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Put('/cancel')
	@Security('jwt', ['SA', 'RES', 'SUB'])
	public async cancelFacilityBooking(
		@Request() request: ISecurityMiddlewareRequest,
		@Body() cancelFacilityBookingDto: CancelFacilityBookingDto,
	): Promise<IResponse<any>> {
		try {
			if (!request.userGuid) {
				throw new OperationError('USER_NOT_FOUND', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const userGuid = await this.userService.getEffectiveUserGuidService(request.userGuid, request.role)
			await this.facilityService.cancelFacilityBookingService(userGuid, cancelFacilityBookingDto)
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

	@Tags('Facility')
	@OperationId('cancelFacilityBooking')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Get('/available-slot/check')
	@Security('jwt', ['SA', 'RES', 'SUB'])
	public async checkFacilitySlot(
		@Request() request: ISecurityMiddlewareRequest,
		@Query() facilityId: string,
		@Query() startDate: string,
		@Query() endDate: string,
	): Promise<IResponse<SpaceAvailabilityDto[]>> {
		try {
			if (!request.userGuid) {
				throw new OperationError('USER_NOT_FOUND', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			let data = await this.facilityService.checkFacilitySlotRepositoryService({
				facilityId,
				startDate,
				endDate,
			})
			const response = {
				message: 'Facility checked successfully',
				status: '200',
				data: data,
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: 'Failed to checked facility booking',
				status: '500',
				data: null,
			}
			return response
		}
	}
}
