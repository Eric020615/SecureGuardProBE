import {
	CancelFacilityBookingDto,
	CreateFacilityBookingDto,
	GetFacilityBookingHistoryDto,
} from '../dtos/facility.dto'
import { FacilityBooking } from '../models/facilityBooking.mode'
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
			this
			await this.facilityRepository.createFacilityBookingRepository(
				new FacilityBooking(
					0,
					createFacilityBookingDto.facilityId,
					convertDateStringToTimestamp(createFacilityBookingDto.startDate),
					convertDateStringToTimestamp(createFacilityBookingDto.endDate),
					createFacilityBookingDto.bookedBy ? createFacilityBookingDto.bookedBy : userId,
					createFacilityBookingDto.numOfGuest,
					false,
					'',
					userId,
					userId,
					getNowTimestamp(),
					getNowTimestamp(),
				),
			)
		} catch (error: any) {
			console.log(error)
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
			let offset = (page - 1) * limit
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

	getAllFacilityBookingService = async () => {
		try {
			const facilityBookings = await this.facilityRepository.getAllFacilityBookingRepository()
			let data: GetFacilityBookingHistoryDto[] = []
			data = facilityBookings
				? facilityBookings.map((facilityBooking) => {
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
			return data
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
}
