import { Timestamp } from "firebase/firestore"

export class FacilityBooking { 
    bookingId?: string
    facilityId: string
    startDate: Timestamp
    endDate: Timestamp
    bookedBy: string
    numOfGuest: number
    isCancelled: boolean
    cancelRemark: string
    createdBy: string
    updatedBy: string
    createdDateTime: Timestamp
    updatedDateTime: Timestamp

    constructor(
        facilityId: string,
        startDate: Timestamp,
        endDate: Timestamp,
        bookedBy: string,
        numOfGuest: number,
        isCancelled: boolean,
        cancelRemark: string,
        createdBy: string,
        updatedBy: string,
        createdDateTime: Timestamp,
        updatedDateTime: Timestamp,
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