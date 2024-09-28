import { Timestamp } from "firebase/firestore"
import { BaseModel } from "./base.model"

export class FacilityBooking extends BaseModel { 
    facilityId: string
    startDate: Timestamp
    endDate: Timestamp
    bookedBy: string
    numOfGuest: number
    isCancelled: boolean
    cancelRemark: string

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
        super(createdBy, updatedBy, createdDateTime, updatedDateTime)
        this.facilityId = facilityId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.bookedBy = bookedBy;
        this.numOfGuest = numOfGuest;
        this.isCancelled = isCancelled;
        this.cancelRemark = cancelRemark;
    }
}