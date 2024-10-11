import {
	CancelFacilityBookingDto,
	CheckFacilitySlotDto,
	CreateFacilityBookingDto,
	GetFacilityBookingHistoryDto,
	SpaceAvailabilityDto,
} from '../dtos/facility.dto'
import { FacilityBooking } from '../models/facilityBooking.model'
import { FacilityBookingRepository } from '../repositories/facility.repository'
import { OperationError } from '../common/operation-error'
import { HttpStatusCode } from '../common/http-status-code'
import {
	convertDateStringToTimestamp,
	convertTimestampToUserTimezone,
	getNowTimestamp,
} from '../helper/time'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { DocumentStatus } from '../common/constants'

@provideSingleton(FacilityService)
export class FacilityService {
	constructor(
		@inject(FacilityBookingRepository)
		private facilityRepository: FacilityBookingRepository,
	) {}
	createFacilityBookingService = async (
		createFacilityBookingDto: CreateFacilityBookingDto,
		userId: string,
	) => {
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
				throw new OperationError(
					'You already have an upcoming booking.',
					HttpStatusCode.INTERNAL_SERVER_ERROR,
				)
			}
			await this.facilityRepository.createFacilityBookingRepository(
				new FacilityBooking(
					0,
					createFacilityBookingDto.facilityId,
					createFacilityBookingDto.spaceId,
					convertDateStringToTimestamp(createFacilityBookingDto.startDate),
					convertDateStringToTimestamp(createFacilityBookingDto.endDate),
					createFacilityBookingDto.bookedBy ? createFacilityBookingDto.bookedBy : userId,
					createFacilityBookingDto.numOfGuest,
					false,
					'',
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

	getFacilityBookingService = async (
		userId: string,
		isPast: boolean,
		page: number,
		limit: number,
	) => {
		try {
			let offset = page * limit + 1
			let { rows, count } = await this.facilityRepository.getFacilityBookingRepository(
				userId,
				isPast,
				offset,
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
							facilityId: facilityBooking.facilityId,
							bookedBy: facilityBooking.bookedBy,
							numOfGuest: facilityBooking.numOfGuest,
							isCancelled: facilityBooking.isCancelled,
							createdBy: facilityBooking.createdBy,
							createdDateTime: convertTimestampToUserTimezone(facilityBooking.createdDateTime),
							updatedBy: facilityBooking.updatedBy,
							updatedDateTime: convertTimestampToUserTimezone(facilityBooking.updatedDateTime),
						} as GetFacilityBookingHistoryDto
				  })
				: []
			return { data, count }
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	getAllFacilityBookingService = async (page: number, limit: number) => {
		try {
			let offset = page * limit + 1
			let { rows, count } = await this.facilityRepository.getAllFacilityBookingRepository(
				offset,
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
							facilityId: facilityBooking.facilityId,
							bookedBy: facilityBooking.bookedBy,
							numOfGuest: facilityBooking.numOfGuest,
							isCancelled: facilityBooking.isCancelled,
							createdBy: facilityBooking.createdBy,
							createdDateTime: convertTimestampToUserTimezone(facilityBooking.createdDateTime),
							updatedBy: facilityBooking.updatedBy,
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

	cancelFacilityBookingService = async (
		userId: string,
		cancelFacilityBookingDto: CancelFacilityBookingDto,
	) => {
		try {
			let facilityBooking: FacilityBooking = {
				isCancelled: true,
				cancelRemark: cancelFacilityBookingDto.cancelRemark
					? cancelFacilityBookingDto.cancelRemark
					: 'Cancel by user',
				updatedBy: userId,
				updatedDateTime: getNowTimestamp(),
			} as FacilityBooking
			await this.facilityRepository.cancelFacilityBookingRepository(
				facilityBooking,
				cancelFacilityBookingDto.bookingGuid,
			)
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
