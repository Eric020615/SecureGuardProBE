import { OperationError } from '../common/operation-error'
import { HttpStatusCode } from '../common/http-status-code'
import {
	CreateVisitorDto,
	GetVisitorDto,
	EditVisitorByIdDto,
	GetVisitorByDateDto,
	GetVisitorDetailsDto,
	GetVisitorPassDetailsDto,
} from '../dtos/visitor.dto'
import { VisitorRepository } from '../repositories/visitor.repository'
import { Visitor } from '../models/visitor.model'
import {
	addTimeToDateString,
	convertDateStringToFormattedString,
	convertDateStringToTimestamp,
	convertTimestampToUserTimezone,
	getCurrentTimestamp,
} from '../helper/time'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import {
	DepartmentEnum,
	DocumentStatus,
	ITimeFormat,
	JobTitleEnum,
	PaginationDirection,
	StaffConst,
} from '../common/constants'
import { MicroEngineService } from './microEngine.service'
import { CreateStaffDto } from '../dtos/microengine.dto'
import { CardService } from './card.service'
import { JwtConfig } from '../config/jwtConfig'
import { VisitorPassTokenPayloadDto } from '../dtos/auth.dto'
import { RoleEnum } from '../common/role'

@provideSingleton(VisitorService)
export class VisitorService {
	constructor(
		@inject(VisitorRepository) private visitorRepository: VisitorRepository,
		@inject(MicroEngineService) private microEngineService: MicroEngineService,
		@inject(CardService) private cardService: CardService,
		@inject(JwtConfig) private jwtConfig: JwtConfig,
	) {}

	createVisitorService = async (createVisitorDto: CreateVisitorDto, userId: string) => {
		try {
			const { id, guid } = await this.visitorRepository.createVisitorRepository(
				new Visitor(
					0,
					createVisitorDto.visitorName,
					createVisitorDto.visitorEmail,
					createVisitorDto.visitorCategory,
					createVisitorDto.visitorContactNumber,
					convertDateStringToTimestamp(createVisitorDto.visitDateTime),
					'',
					'',
					DocumentStatus.Active,
					userId,
					userId,
					getCurrentTimestamp(),
					getCurrentTimestamp(),
				),
			)
			if (!id) {
				throw new OperationError('Failed to create visitor', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			let staffInfo = {
				...StaffConst,
				Profile: {
					Branch: 'HQ',
					Department: DepartmentEnum.VI,
					JobTitle: JobTitleEnum.VI,
					EmailAddress: createVisitorDto.visitorEmail,
					ContactNo: createVisitorDto.visitorContactNumber,
					Remark1: userId,
				},
				AccessControlData: {
					AccessEntryDate: convertDateStringToFormattedString(createVisitorDto.visitDateTime, ITimeFormat.dateTime),
					AccessExitDate: addTimeToDateString(createVisitorDto.visitDateTime, 'hours', 2, ITimeFormat.dateTime),
					DoorAccessRightId: '0001',
					FloorAccessRightId: '001',
					DefaultFloorGroupId: 'N/Available',
				},
				Card: {
					BadgeCategory: 'QRCode',
				},
				UserId: `${RoleEnum.VISITOR} ${id.toString()}`,
				UserName: createVisitorDto.visitorName,
				UserType: 'Normal',
			} as CreateStaffDto
			const badgeNumber = await this.microEngineService.addUser(staffInfo, userId)
			if (!badgeNumber) {
				throw new OperationError('Failed to create visitor temporary card', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			await this.microEngineService.sendByCardGuid()
			const token = this.jwtConfig.createToken({
				visitorGuid: guid,
			} as VisitorPassTokenPayloadDto)
			if (!token) {
				throw new OperationError('Failed to generate token', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			let visitor: Visitor = {
				badgeNumber: badgeNumber.toString(),
				token: token,
				updatedBy: userId,
				updatedDateTime: getCurrentTimestamp(),
			} as Visitor
			await this.visitorRepository.editVisitorByIdRepository(guid, visitor)
		} catch (error: any) {
			console.log(error)
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	editVisitorByIdService = async (editVisitorByIdDto: EditVisitorByIdDto, visitorGuid: string, userId: string) => {
		try {
			let visitor: Visitor = {
				visitorName: editVisitorByIdDto.visitorName,
				visitorCategory: editVisitorByIdDto.visitorCategory,
				visitorContactNumber: editVisitorByIdDto.visitorContactNumber,
				visitDateTime: convertDateStringToTimestamp(editVisitorByIdDto.visitDateTime),
				updatedBy: userId,
				updatedDateTime: getCurrentTimestamp(),
			} as Visitor
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
							visitorCategory: visitor.visitorCategory,
							visitorContactNumber: visitor.visitorContactNumber,
							visitDateTime: convertTimestampToUserTimezone(visitor.visitDateTime),
							status: DocumentStatus[visitor.status],
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
				visitorCategory: visitors.visitorCategory,
				visitorContactNumber: visitors.visitorContactNumber,
				visitDateTime: convertTimestampToUserTimezone(visitors.visitDateTime),
				status: DocumentStatus[visitors.status],
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

	getVisitorByAdminService = async (direction: PaginationDirection, id: number, limit: number) => {
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
							visitorCategory: visitor.visitorCategory,
							visitorContactNumber: visitor.visitorContactNumber,
							visitDateTime: convertTimestampToUserTimezone(visitor.visitDateTime),
							status: DocumentStatus[visitor.status],
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
			const qrCode = await this.cardService.getQrCodeByVisitor(visitors.id, visitors.badgeNumber)
			let data: GetVisitorPassDetailsDto = {} as GetVisitorPassDetailsDto
			data = {
				visitorId: visitors.id,
				visitorGuid: visitors.guid ? visitors.guid : '',
				visitorName: visitors.visitorName,
				visitorEmail: visitors.visitorEmail,
				visitorCategory: visitors.visitorCategory,
				visitorContactNumber: visitors.visitorContactNumber,
				visitDateTime: convertTimestampToUserTimezone(visitors.visitDateTime),
				qrCode: qrCode,
			}
			return data
		} catch (error: any) {
			console.log(error)
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}
}
