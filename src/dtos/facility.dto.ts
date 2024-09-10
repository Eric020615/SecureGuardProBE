export interface CreateFacilityBookingDto {
	bookedBy?: string
	facilityId: string
	startDate: string
	endDate: string
	numOfGuest: number
}

export interface GetFacilityBookingHistoryDto {
	bookingId: string
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
	bookingId: string
	cancelRemark?: string
}