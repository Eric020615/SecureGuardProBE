import { FacilityEnum } from "../common/constants"

export interface CreateFacilityBookingDto {
	bookedBy?: string
	facilityId: keyof typeof FacilityEnum
	startDate: string
	endDate: string
	numOfGuest: number
	spaceId: string
}

export interface GetFacilityBookingHistoryDto {
	bookingId: number
	bookingGuid: string
	facilityName: string
	startDate: string
	endDate: string
	bookedBy: string
	isCancelled: boolean
	status: string
}

export interface GetFacilityBookingDetailsDto {
	bookingId: number
	bookingGuid: string
	facilityName: string
	startDate: string
	endDate: string
	bookedBy: string
	numOfGuest: number
	isCancelled: boolean
	cancelRemark: string
	status: string
	createdBy: string
	createdDateTime: string
	updatedBy: string
	updatedDateTime: string
}

export interface CancelFacilityBookingDto {
	cancelRemark?: string
}

export interface CheckFacilitySlotDto {
	facilityId: string
	startDate: string
	endDate: string
}

export interface SpaceAvailabilityDto {
	spaceId: string
	spaceName: string
	isBooked: boolean // Change to isBooked or any other name if required
	capacity: number
}

export interface GetFacilityBookingUserDto {
    userGuid: string
	email: string
}