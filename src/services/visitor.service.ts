import { OperationError } from '../common/operation-error'
import { HttpStatusCode } from '../common/http-status-code'
import {
	CreateVisitorDto,
	GetVisitorDto,
	EditVisitorByIdDto,
	GetVisitorByDateDto,
	GetVisitorDetailsDto,
	GetVisitorPassDetailsDto,
	GetVisitorDetailsByTokenDto,
} from '../dtos/visitor.dto'
import { VisitorRepository } from '../repositories/visitor.repository'
import { Visitors } from '../models/visitors.model'
import {
	calculateDateDifference,
	convertDateStringToTimestamp,
	convertTimestampToUserTimezone,
	getCurrentDateString,
	getCurrentTimestamp,
} from '../helper/time'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import {
	DocumentStatusEnum,
	ITimeFormat,
	PaginationDirectionEnum,
	VisitorCategoryEnum,
	VisitStatusEnum,
} from '../common/constants'
import { MicroEngineService } from './microEngine.service'
import { JwtConfig } from '../config/jwtConfig'
import { VisitorPassTokenPayloadDto } from '../dtos/auth.dto'

@provideSingleton(VisitorService)
export class VisitorService {
	constructor(
		@inject(VisitorRepository) private visitorRepository: VisitorRepository,
		@inject(MicroEngineService) private microEngineService: MicroEngineService,
		@inject(JwtConfig) private jwtConfig: JwtConfig,
	) {}

	createVisitorService = async (createVisitorDto: CreateVisitorDto, userId: string) => {
		try {
			const { id, guid } = await this.visitorRepository.createVisitorRepository(
				new Visitors(
					0,
					createVisitorDto.visitorName,
					createVisitorDto.visitorEmail,
					VisitorCategoryEnum[createVisitorDto.visitorCategory as unknown as keyof typeof VisitorCategoryEnum],
					createVisitorDto.visitorContactNumber,
					convertDateStringToTimestamp(createVisitorDto.visitDateTime),
					'',
					'',
					VisitStatusEnum.Scheduled,
					DocumentStatusEnum.ACTIVE,
					userId,
					userId,
					getCurrentTimestamp(),
					getCurrentTimestamp(),
				),
			)
			if (!id) {
				throw new OperationError('Failed to create visitor', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const token = this.jwtConfig.createToken(
				{
					visitorGuid: guid,
				} as VisitorPassTokenPayloadDto,
				calculateDateDifference(getCurrentDateString(ITimeFormat.isoDateTime), createVisitorDto.visitDateTime),
			)
			if (!token) {
				throw new OperationError('Failed to generate token', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			let visitor: Visitors = {
				token: token,
				updatedBy: userId,
				updatedDateTime: getCurrentTimestamp(),
			} as Visitors
			await this.visitorRepository.editVisitorByIdRepository(guid, visitor)
		} catch (error: any) {
			console.log(error)
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	editVisitorByIdService = async (editVisitorByIdDto: EditVisitorByIdDto, visitorGuid: string, userId: string) => {
		try {
			let visitor: Visitors = {
				visitorName: editVisitorByIdDto.visitorName,
				visitorCategory: VisitorCategoryEnum[editVisitorByIdDto.visitorCategory],
				visitorContactNumber: editVisitorByIdDto.visitorContactNumber,
				visitDateTime: convertDateStringToTimestamp(editVisitorByIdDto.visitDateTime),
				updatedBy: userId,
				updatedDateTime: getCurrentTimestamp(),
			} as Visitors
			await this.visitorRepository.editVisitorByIdRepository(visitorGuid, visitor)
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	getVisitorByResidentService = async (userId: string, isPast: boolean, id: number, limit: number) => {
		try {
			let { rows, count } = await this.visitorRepository.getVisitorByResidentRepository(userId, isPast, id, limit)
			let data: GetVisitorDto[] = []
			data = rows
				? rows.map((visitor) => {
						return {
							visitorId: visitor.id,
							visitorGuid: visitor.guid ? visitor.guid : '',
							visitorName: visitor.visitorName,
							visitorCategory: VisitorCategoryEnum[visitor.visitorCategory],
							visitorContactNumber: visitor.visitorContactNumber,
							visitDateTime: convertTimestampToUserTimezone(visitor.visitDateTime),
							status: DocumentStatusEnum[visitor.status],
						} as GetVisitorDto
				  })
				: []
			return { data, count }
		} catch (error: any) {
			console.log(error)
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	getVisitorDetailsService = async (visitorGuid: string) => {
		try {
			const visitors = await this.visitorRepository.getVisitorDetailsRepository(visitorGuid)
			let data: GetVisitorDetailsDto = {} as GetVisitorDetailsDto
			data = {
				visitorId: visitors.id,
				visitorGuid: visitors.guid ? visitors.guid : '',
				visitorName: visitors.visitorName,
				visitorEmail: visitors.visitorEmail,
				visitorCategory: VisitorCategoryEnum[visitors.visitorCategory] as keyof typeof VisitorCategoryEnum,
				visitorContactNumber: visitors.visitorContactNumber,
				visitDateTime: convertTimestampToUserTimezone(visitors.visitDateTime),
				token: visitors.token,
				status: DocumentStatusEnum[visitors.status] as keyof typeof DocumentStatusEnum,
				createdBy: visitors.createdBy,
				updatedBy: visitors.updatedBy,
				createdDateTime: convertTimestampToUserTimezone(visitors.createdDateTime),
				updatedDateTime: convertTimestampToUserTimezone(visitors.updatedDateTime),
			}
			return data
		} catch (error: any) {
			console.log(error)
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	getVisitorByAdminService = async (direction: PaginationDirectionEnum, id: number, limit: number) => {
		try {
			let { rows, count } = await this.visitorRepository.getVisitorByAdminRepository(direction, id, limit)
			let data: GetVisitorDto[] = []
			data = rows
				? rows.map((visitor) => {
						return {
							visitorId: visitor.id,
							visitorGuid: visitor.guid ? visitor.guid : '',
							visitorName: visitor.visitorName,
							visitorEmail: visitor.visitorEmail,
							visitorCategory: VisitorCategoryEnum[visitor.visitorCategory],
							visitorContactNumber: visitor.visitorContactNumber,
							visitDateTime: convertTimestampToUserTimezone(visitor.visitDateTime),
							status: DocumentStatusEnum[visitor.status],
						} as GetVisitorDto
				  })
				: []
			return { data, count }
		} catch (error: any) {
			console.log(error)
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	getVisitorCountsByDayService = async (startDate: string, endDate: string) => {
		try {
			let data: GetVisitorByDateDto[] = []
			let visitorCountsByDay = await this.visitorRepository.getVisitorCountsByDayRepository(startDate, endDate)
			Object.keys(visitorCountsByDay).map((date) => {
				data.push({ date: date, count: visitorCountsByDay[date] })
			})
			return data
		} catch (error) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	getVisitorPassDetailsService = async (visitorGuid: string) => {
		try {
			const visitors = await this.visitorRepository.getVisitorDetailsRepository(visitorGuid)
			let data: GetVisitorPassDetailsDto = {} as GetVisitorPassDetailsDto
			data = {
				visitorId: visitors.id,
				visitorGuid: visitors.guid ? visitors.guid : '',
				visitorName: visitors.visitorName,
				visitorEmail: visitors.visitorEmail,
				visitorCategory: VisitorCategoryEnum[visitors.visitorCategory] as keyof typeof VisitorCategoryEnum,
				visitorContactNumber: visitors.visitorContactNumber,
				visitDateTime: convertTimestampToUserTimezone(visitors.visitDateTime),
			}
			return data
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	getVisitorDetailsByTokenService = async (visitorGuid: string) => {
		try {
			const visitors = await this.visitorRepository.getVisitorDetailsRepository(visitorGuid)
			let data: GetVisitorDetailsByTokenDto = {} as GetVisitorDetailsByTokenDto
			if (visitors.visitDateTime < getCurrentTimestamp()) {
				throw new OperationError('Visitors pass expired', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			data = {
				visitorId: visitors.id,
				visitorGuid: visitors.guid ? visitors.guid : '',
				visitorName: visitors.visitorName,
				visitorEmail: visitors.visitorEmail,
				visitorCategory: VisitorCategoryEnum[visitors.visitorCategory] as keyof typeof VisitorCategoryEnum,
				visitorContactNumber: visitors.visitorContactNumber,
				visitDateTime: convertTimestampToUserTimezone(visitors.visitDateTime),
			}
			return data
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}
}
