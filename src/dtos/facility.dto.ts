export interface CreateFacilityBookingDto {
	bookedBy?: string
	facilityId: string
	startDate: string
	endDate: string
	numOfGuest: number
}

export interface GetFacilityBookingHistoryDto {
	bookingId: number
	bookingGuid: string
	startDate: string
	facilityId: string
	facilityName: string
	endDate: string
	bookedBy: string
	numOfGuest: number
	isCancelled: boolean
	cancelRemark: string
	createdBy: string
	createdDateTime: string
	updatedBy: string
	updatedDateTime: string
}

export interface CancelFacilityBookingDto {
	bookingGuid: string
	cancelRemark?: string
}

export interface CheckFacilitySlotDto {
	facilityId: string
	startDate: string
	duration: number
}

export interface SpaceAvailabilityDto {
	spaceId: string
	spaceName: string
	isBooked: boolean // Change to isBooked or any other name if required
	capacity: number
}
