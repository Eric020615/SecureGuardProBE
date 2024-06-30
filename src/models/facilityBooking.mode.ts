export class FacilityBooking { 
    bookingId?: string
    facilityId: string
    startDate: number
    endDate: number
    bookedBy: string
    numOfGuest: number
    isCancelled: boolean
    cancelRemark: string
    createdBy: string
    updatedBy: string
    createdDateTime: number
    updatedDateTime: number

    constructor(
        facilityId: string,
        startDate: number,
        endDate: number,
        bookedBy: string,
        numOfGuest: number,
        isCancelled: boolean,
        cancelRemark: string,
        createdBy: string,
        updatedBy: string,
        createdDateTime: number,
        updatedDateTime: number,
    ){
        this.facilityId = facilityId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.bookedBy = bookedBy;
        this.numOfGuest = numOfGuest;
        this.isCancelled = isCancelled;
        this.cancelRemark = cancelRemark;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.createdDateTime = createdDateTime;
        this.updatedDateTime = updatedDateTime;
    }
}