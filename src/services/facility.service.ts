import {
	CancelFacilityBookingDto,
	CheckFacilitySlotDto,
	CreateFacilityBookingDto,
	GetFacilityBookingDetailsDto,
	GetFacilityBookingHistoryDto,
	SpaceAvailabilityDto,
} from '../dtos/facility.dto'
import { FacilityBookingRepository } from '../repositories/facility.repository'
import { OperationError } from '../common/operation-error'
import { HttpStatusCode } from '../common/http-status-code'
import { convertDateStringToTimestamp, convertTimestampToUserTimezone, getCurrentTimestamp } from '../helper/time'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { DocumentStatusEnum, FacilityEnum, PaginationDirectionEnum } from '../common/constants'
import { FacilityBookings } from '../models/facilities.model'

@provideSingleton(FacilityService)
export class FacilityService {
	constructor(
		@inject(FacilityBookingRepository)
		private facilityRepository: FacilityBookingRepository,
	) {}
	createFacilityBookingService = async (createFacilityBookingDto: CreateFacilityBookingDto, userId: string) => {
		try {
			let facilitySlot: SpaceAvailabilityDto
			facilitySlot = (await this.facilityRepository.checkFacilitySlotRepository(
				createFacilityBookingDto.facilityId,
				createFacilityBookingDto.startDate,
				createFacilityBookingDto.endDate,
				createFacilityBookingDto.spaceId,
			)) as SpaceAvailabilityDto
			if (facilitySlot.capacity < createFacilityBookingDto.numOfGuest) {
				throw new OperationError('Exceed capacity', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			if (facilitySlot.isBooked) {
				throw new OperationError('Facility is already booked', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			const isBookedBefore = await this.facilityRepository.checkUpcomingBookingRepository(
				createFacilityBookingDto.bookedBy ? createFacilityBookingDto.bookedBy : userId,
			)
			if (isBookedBefore) {
				throw new OperationError('An upcoming booking already exists for this account.', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			await this.facilityRepository.createFacilityBookingRepository(
				new FacilityBookings(
					0,
					FacilityEnum[createFacilityBookingDto.facilityId],
					createFacilityBookingDto.spaceId,
					convertDateStringToTimestamp(createFacilityBookingDto.startDate),
					convertDateStringToTimestamp(createFacilityBookingDto.endDate),
					createFacilityBookingDto.bookedBy ? createFacilityBookingDto.bookedBy : userId,
					createFacilityBookingDto.numOfGuest,
					false,
					'',
					DocumentStatusEnum.ACTIVE,
					userId,
					userId,
					getCurrentTimestamp(),
					getCurrentTimestamp(),
				),
			)
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	getFacilityBookingService = async (userId: string, isPast: boolean, id: number, limit: number) => {
		try {
			let { rows, count } = await this.facilityRepository.getFacilityBookingRepository(userId, isPast, id, limit)
			let data: GetFacilityBookingHistoryDto[] = []
			data = rows
				? rows.map((facilityBooking) => {
						return {
							bookingId: facilityBooking.id,
							bookingGuid: facilityBooking.guid,
							startDate: convertTimestampToUserTimezone(facilityBooking.startDate),
							endDate: convertTimestampToUserTimezone(facilityBooking.endDate),
							facilityId: FacilityEnum[facilityBooking.facility],
							bookedBy: facilityBooking.bookedBy,
							numOfGuest: facilityBooking.numOfGuest,
							isCancelled: facilityBooking.isCancelled,
							status: DocumentStatusEnum[facilityBooking.status],
							createdDateTime: convertTimestampToUserTimezone(facilityBooking.createdDateTime),
							updatedDateTime: convertTimestampToUserTimezone(facilityBooking.updatedDateTime),
						} as GetFacilityBookingHistoryDto
				  })
				: []
			return { data, count }
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	getFacilityBookingHistoryByAdminService = async (direction: PaginationDirectionEnum, id: number, limit: number) => {
		try {
			let { rows, count } = await this.facilityRepository.getFacilityBookingHistoryByAdminRepository(
				direction,
				id,
				limit,
			)
			let data: GetFacilityBookingHistoryDto[] = []
			data = rows
				? rows.map((facilityBooking) => {
						return {
							bookingId: facilityBooking.id,
							bookingGuid: facilityBooking.guid,
							startDate: convertTimestampToUserTimezone(facilityBooking.startDate),
							endDate: convertTimestampToUserTimezone(facilityBooking.endDate),
							facilityId: FacilityEnum[facilityBooking.facility],
							bookedBy: facilityBooking.bookedBy,
							numOfGuest: facilityBooking.numOfGuest,
							isCancelled: facilityBooking.isCancelled,
							status: DocumentStatusEnum[facilityBooking.status],
							createdDateTime: convertTimestampToUserTimezone(facilityBooking.createdDateTime),
							updatedDateTime: convertTimestampToUserTimezone(facilityBooking.updatedDateTime),
						} as GetFacilityBookingHistoryDto
				  })
				: []
			return { data, count }
		} catch (error: any) {
			console.log(error)
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	getFacilityBookingDetailsByFacilityBookingGuidService = async (facilityBookingGuid: string) => {
		try {
			let facilityBooking: FacilityBookings =
				await this.facilityRepository.getFacilityBookingDetailsByFacilityBookingGuidRepository(facilityBookingGuid)
			let data: GetFacilityBookingDetailsDto = {} as GetFacilityBookingDetailsDto
			data = {
				bookingId: facilityBooking.id,
				bookingGuid: facilityBooking.guid ? facilityBooking.guid : '',
				facilityId: FacilityEnum[facilityBooking.facility],
				startDate: convertTimestampToUserTimezone(facilityBooking.startDate),
				endDate: convertTimestampToUserTimezone(facilityBooking.endDate),
				bookedBy: facilityBooking.bookedBy,
				numOfGuest: facilityBooking.numOfGuest,
				isCancelled: facilityBooking.isCancelled,
				cancelRemark: facilityBooking.cancelRemark,
				status: DocumentStatusEnum[facilityBooking.status],
				createdBy: facilityBooking.createdBy,
				createdDateTime: convertTimestampToUserTimezone(facilityBooking.createdDateTime),
				updatedBy: facilityBooking.updatedBy,
				updatedDateTime: convertTimestampToUserTimezone(facilityBooking.updatedDateTime),
			} as GetFacilityBookingDetailsDto
			return data
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	cancelFacilityBookingService = async (
		userId: string,
		facilityBookingGuid: string,
		cancelFacilityBookingDto: CancelFacilityBookingDto,
	) => {
		try {
			let facilityBooking: FacilityBookings = {
				isCancelled: true,
				cancelRemark: cancelFacilityBookingDto.cancelRemark ? cancelFacilityBookingDto.cancelRemark : 'Cancel by user',
				updatedBy: userId,
				updatedDateTime: getCurrentTimestamp(),
			} as FacilityBookings
			await this.facilityRepository.cancelFacilityBookingRepository(facilityBooking, facilityBookingGuid)
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	checkFacilitySlotRepositoryService = async (checkFacilitySlotDto: CheckFacilitySlotDto) => {
		try {
			const spaceAvailability = (await this.facilityRepository.checkFacilitySlotRepository(
				checkFacilitySlotDto.facilityId,
				checkFacilitySlotDto.startDate,
				checkFacilitySlotDto.endDate,
			)) as SpaceAvailabilityDto[]
			return spaceAvailability
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}
}
