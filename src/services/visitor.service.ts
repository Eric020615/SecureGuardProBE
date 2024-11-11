import { OperationError } from '../common/operation-error'
import { HttpStatusCode } from '../common/http-status-code'
import {
	CreateVisitorDto,
	GetVisitorDto,
	EditVisitorByIdDto,
	GetVisitorByDateDto,
	GetVisitorDetailsDto,
} from '../dtos/visitor.dto'
import { VisitorRepository } from '../repositories/visitor.repository'
import { Visitor } from '../models/visitor.model'
import { convertDateStringToTimestamp, convertTimestampToUserTimezone, getCurrentTimestamp } from '../helper/time'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { DepartmentEnum, DocumentStatus, JobTitleEnum, PaginationDirection, StaffConst } from '../common/constants'
import { MicroEngineService } from './microEngine.service'
import { CreateStaffDto } from '../dtos/microengine.dto'

@provideSingleton(VisitorService)
export class VisitorService {
	constructor(
		@inject(VisitorRepository) private visitorRepository: VisitorRepository,
		@inject(MicroEngineService) private microEngineService: MicroEngineService,
	) {}

	createVisitorService = async (createVisitorDto: CreateVisitorDto, userId: string) => {
		try {
			await this.visitorRepository.createVisitorRepository(
				new Visitor(
					0,
					createVisitorDto.visitorName,
					createVisitorDto.visitorEmail,
					createVisitorDto.visitorCategory,
					createVisitorDto.visitorContactNumber,
					convertDateStringToTimestamp(createVisitorDto.visitDateTime),
					DocumentStatus.Active,
					userId,
					userId,
					getCurrentTimestamp(),
					getCurrentTimestamp(),
				),
			)
			// // if not exists create new card and person
			// let staffInfo = {
			// 	...StaffConst,
			// 	Profile: {
			// 		Branch: 'HQ',
			// 		Department: DepartmentEnum.VI,
			// 		JobTitle: JobTitleEnum.VI,
			// 		EmailAddress: createVisitorDto.visitorEmail,
			// 		ContactNo: createVisitorDto.visitorContactNumber,
			// 		Remark1: userId,
			// 	},
			// 	AccessControlData: {
			// 		AccessEntryDate: createVisitorDto.visitDateTime,
			// 		AccessExitDate: '2025-12-31',
			// 		DoorAccessRightId: '0001',
			// 		FloorAccessRightId: '001',
			// 		DefaultFloorGroupId: 'N/Available',
			// 	},
			// 	Card: {
			// 		BadgeCategory: 'QRCode',
			// 	},
			// 	UserId: `${JobTitleEnum.VI} ${visitorId.toString()}`,
			// 	UserName: createVisitorDto.visitorName,
			// 	UserType: 'Normal',
			// } as CreateStaffDto
			// const badgeNumber = await this.microEngineService.addUser(staffInfo, userId)
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
}
