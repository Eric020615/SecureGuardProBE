export interface CreateBookingDto {
    userGUID: string;
    facilityId: string;
    startDate: string;
    endDate: string;
    numOfGuest: number;
}

export interface GetBookingHistoryDto { 
    bookingId: string
    startDate: string
    facilityId: string
    facilityName: string
    endDate: string
    userGUID: string
    numOfGuest: number
    isCancelled: boolean
}