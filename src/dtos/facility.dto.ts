export interface CreateBookingDto {
    userGUID: string;
    facilityId: string;
    startDate: string;
    endDate: string;
    numOfGuest: number;
}