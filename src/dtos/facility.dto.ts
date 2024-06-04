export interface CreateBookingDto {
    userGUID: string;
    facilityId: number;
    startDate: string;
    endDate: string;
    numOfGuest: number;
}