export class Facility { 
    bookingId: string
    startDate: string
    facilityId: string
    facilityName: string
    endDate: string
    userGUID: string
    numOfGuest: number
    isCancelled: boolean
    createdBy: string
    updatedBy: string
    createdDateTime: Date
    updatedDateTime: Date

    constructor(
        bookingId: string,
        startDate: string,
        facilityId: string,
        facilityName: string,
        endDate: string,
        userGUID: string,
        numOfGuest: number,
        isCancelled: boolean,
        createdBy: string,
        updatedBy: string,
        createdDateTime: Date,
        updatedDateTime: Date,
    ){
        this.bookingId = bookingId;
        this.startDate = startDate;
        this.facilityId = facilityId;
        this.facilityName = facilityName;
        this.endDate = endDate;
        this.userGUID = userGUID;
        this.numOfGuest = numOfGuest;
        this.isCancelled = isCancelled;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.createdDateTime = createdDateTime;
        this.updatedDateTime = updatedDateTime;
    }
}