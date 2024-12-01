import { IPaginatedResponse, IResponse } from '../dtos/index.dto'
import { Controller, OperationId, Get, Response, Route, SuccessResponse, Tags, Security, Query } from 'tsoa'
import { HttpStatusCode } from '../common/http-status-code'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { PaginationDirectionEnum } from '../common/constants'
import { GetFacilityBookingHistoryDto, GetFacilityBookingUserDto, SpaceAvailabilityDto } from '../dtos/facility.dto'
import { FacilityService } from '../services/facility.service'
import { UserService } from '../services/user.service'

@Route('facilities/admin')
@provideSingleton(FacilityManagementController)
export class FacilityManagementController extends Controller {
	constructor(
		@inject(FacilityService)
		private facilityService: FacilityService,
		@inject(UserService)
		private userService: UserService,
	) {
		super()
	}

	@Tags('Facility Management')
	@OperationId('getFacilityBookingUser')
	@Response<IResponse<GetFacilityBookingUserDto[]>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Get('/bookings/users')
	@Security('jwt', ['SA'])
	public async getFacilityBookingUser(): Promise<IResponse<GetFacilityBookingUserDto>> {
		try {
			const data = await this.userService.getFacilityBookingUserService()
			const response = {
				message: 'Facility booking user retrieve successfully',
				status: '200',
				data: data,
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: 'Failed to retrieve facility booking user',
				status: '500',
				data: null,
			}
			return response
		}
	}

	@Tags('Facility Management')
	@OperationId('getFacilityBookingHistoryByAdmin')
	@Response<IResponse<GetFacilityBookingHistoryDto[]>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Get('/bookings')
	@Security('jwt', ['SA'])
	public async getFacilityBookingHistoryByAdmin(
		@Query() direction: PaginationDirectionEnum.Next | PaginationDirectionEnum.Previous,
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
}
