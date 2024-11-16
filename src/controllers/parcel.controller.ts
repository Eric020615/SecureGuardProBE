import { IPaginatedResponse, IResponse } from '../dtos/index.dto'
import { ParcelService } from '../services/parcel.service'
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
	Query,
	Path,
	Delete,
} from 'tsoa'
import { GetParcelDetailsDto, GetParcelDto } from '../dtos/parcel.dto'
import { HttpStatusCode } from '../common/http-status-code'
import { ISecurityMiddlewareRequest } from '../middleware/security.middleware'
import { OperationError } from '../common/operation-error'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { UserService } from '../services/user.service'
import { RoleEnum } from '../common/role'
import { ResidentInformationDto } from '../dtos/user.dto'

@Route('parcels')
@provideSingleton(ParcelController)
export class ParcelController extends Controller {
	constructor(
		@inject(ParcelService) private parcelService: ParcelService,
		@inject(UserService) private userService: UserService,
	) {
		super()
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
			let { data, count } = await this.parcelService.getParcelByResidentService(
				id,
				limit,
				roleInformation.floor,
				roleInformation.unit,
			)
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
	@OperationId('getParcelById')
	@Response<IResponse<GetParcelDetailsDto>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Get('/{id}/details')
	@Security('jwt', ['RES', 'SUB', 'SA', 'STF'])
	public async getParcelDetailsById(@Path() id: string): Promise<IResponse<GetParcelDetailsDto>> {
		try {
			let data = await this.parcelService.getParcelDetailsByIdService(id)
			const response = {
				message: 'Parcel retrieved successfully',
				status: '200',
				data: data,
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: 'Failed to retrieve parcel',
				status: '500',
				data: null,
			}
			return response
		}
	}

	@Tags('Parcel')
	@OperationId('deleteParcelById')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Delete('/{id}')
	@Security('jwt', ['RES'])
	public async deleteParcelById(@Path() id: string): Promise<IResponse<any>> {
		try {
			let data = await this.parcelService.deleteParcelByIdService(id)
			const response = {
				message: 'Parcel deleted successfully',
				status: '200',
				data: data,
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: 'Failed to delete parcel',
				status: '500',
				data: null,
			}
			return response
		}
	}
}
