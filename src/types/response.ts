export interface IResponse<T> {
    message?: string
    data?: T | T[] | null
    code?: number
}

export interface getBookingHistoryResponse { 
    bookingId: string
    startDate: string
    facilityId: string
    facilityName: string
    endDate: string
    userGUID: string
    numOfGuest: number
    isCancelled: boolean
}

export interface getNoticeResponse {
    noticeId: string
    title: string;
    description: string;
    startDate: string;
    endDate: string;
}