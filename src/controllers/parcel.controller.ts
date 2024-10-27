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
import { RoleEnum } from '../common/role'
import { ResidentInformationDto } from '../dtos/user.dto'

@Route('parcel')
@provideSingleton(ParcelController)
export class ParcelController extends Controller {
	constructor(@inject(ParcelService) private parcelService: ParcelService, @inject(UserService) private userService: UserService) {
		super()
	}

	@Tags('Parcel')
	@OperationId('createParcel')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Post('/staff')
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

	@Tags('Parcel')
	@OperationId('getParcelByResident')
	@Response<IResponse<GetParcelDto[]>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Get('/')
	@Security('jwt', ['RES', 'SUB'])
	public async getParcelByResident(
		@Request() request: ISecurityMiddlewareRequest,
		@Query() id: number,
		@Query() limit: number,
	): Promise<IPaginatedResponse<GetParcelDto>> {
		try {
			if (!request.userGuid) {
				throw new OperationError('USER_NOT_FOUND', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			let userData = await this.userService.getUserDetailsByIdService(request.userGuid)
			if (userData.role !== RoleEnum.RESIDENT) {
				throw new OperationError('ROLE_NOT_PERMITTED', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			let roleInformation = userData.roleInformation as ResidentInformationDto
			let { data, count } = await this.parcelService.getParcelByResidentService(id, limit, roleInformation.floor, roleInformation.unit);
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

	@Tags('Parcel')
	@OperationId('getParcelByStaff')
	@Response<IResponse<GetParcelDto[]>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Get('/staff')
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
			let { data, count } = await this.parcelService.getParcelByStaffService(id, limit, request.userGuid);
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
