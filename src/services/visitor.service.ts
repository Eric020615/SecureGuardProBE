import { OperationError } from '../common/operation-error'
import { HttpStatusCode } from '../common/http-status-code'
import { CreateVisitorDto, GetVisitorDto, EditVisitorByIdDto } from '../dtos/visitor.dto'
import {
	VisitorRepository
} from '../repositories/visitor.repository'
import { Visitor } from '../models/visitor.model'
import {
	convertDateStringToTimestamp,
	convertTimestampToUserTimezone,
	getNowTimestamp,
} from '../helper/time'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { DocumentStatus } from '../common/constants'

@provideSingleton(VisitorService)
export class VisitorService {
	constructor(@inject(VisitorRepository) private visitorRepository: VisitorRepository ){}
	createVisitorService = async (createVisitorDto: CreateVisitorDto, userId: string) => {
		try {
			await this.visitorRepository.createVisitorRepository(
				new Visitor(
					0,
					createVisitorDto.visitorName,
					createVisitorDto.visitorCategory,
					createVisitorDto.visitorContactNumber,
					convertDateStringToTimestamp(createVisitorDto.visitDateTime),
					DocumentStatus.Active,
					userId,
					userId,
					getNowTimestamp(),
					getNowTimestamp(),
				),
			)
		} catch (error: any) {
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
				updatedDateTime: getNowTimestamp(),
			} as Visitor
			await this.visitorRepository.editVisitorByIdRepository(visitorGuid, visitor)
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	getVisitorByResidentService = async (userId: string, isPast: boolean) => {
		try {
			const visitors = await this.visitorRepository.getVisitorByResidentRepository(userId, isPast)
			let data: GetVisitorDto[] = []
			data = visitors
				? visitors.map((visitor) => {
						return {
							visitorId: visitor.id,
							visitorGuid: visitor.guid ? visitor.guid : '',
							visitorName: visitor.visitorName,
							visitorCategory: visitor.visitorCategory,
							visitorContactNumber: visitor.visitorContactNumber,
							visitDateTime: convertTimestampToUserTimezone(visitor.visitDateTime),
							createdBy: visitor.createdBy,
							updatedBy: visitor.updatedBy,
							createdDateTime: convertTimestampToUserTimezone(visitor.createdDateTime),
							updatedDateTime: convertTimestampToUserTimezone(visitor.updatedDateTime),
						} as GetVisitorDto
				  })
				: []
			return data
		} catch (error: any) {
			console.log(error)
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	getVisitorDetailsByResidentService = async (visitorGuid: string) => {
		try {
			const visitors = await this.visitorRepository.getVisitorDetailsByResidentRepository(visitorGuid)
			let data: GetVisitorDto = {} as GetVisitorDto
			data = {
				visitorId: visitors.id,
				visitorGuid: visitors.guid ? visitors.guid : '',
				visitorName: visitors.visitorName,
				visitorCategory: visitors.visitorCategory,
				visitorContactNumber: visitors.visitorContactNumber,
				visitDateTime: convertTimestampToUserTimezone(visitors.visitDateTime),
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

	getAllVisitorService = async () => {
		try {
			const visitors = await this.visitorRepository.getAllVisitorsRepository()
			let data: GetVisitorDto[] = []
			data = visitors
				? visitors.map((visitor) => {
						return {
							visitorId: visitor.id,
							visitorGuid: visitor.guid ? visitor.guid : '',
							visitorName: visitor.visitorName,
							visitorCategory: visitor.visitorCategory,
							visitorContactNumber: visitor.visitorContactNumber,
							visitDateTime: convertTimestampToUserTimezone(visitor.visitDateTime),
							createdBy: visitor.createdBy,
							updatedBy: visitor.updatedBy,
							createdDateTime: convertTimestampToUserTimezone(visitor.createdDateTime),
							updatedDateTime: convertTimestampToUserTimezone(visitor.updatedDateTime),
						} as GetVisitorDto
				  })
				: []
			return data
		} catch (error: any) {
			console.log(error)
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}
}
