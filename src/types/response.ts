export interface IResponse<T> {
    message?: string
    data?: T | T[] | null
    code?: number
}

export interface getBookingHistoryResponse { 
    startDate: string
    facilityId: string
    facilityName: string
    endDate: string
    userGUID: string
    numOfGuest: number
}