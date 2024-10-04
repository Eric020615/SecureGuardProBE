import { Timestamp } from "firebase/firestore"
import { BaseModel } from "./base.model"

export class FacilityBooking extends BaseModel { 
    facilityId: string
    spaceId: string
    startDate: Timestamp
    endDate: Timestamp
    bookedBy: string
    numOfGuest: number
    isCancelled: boolean
    cancelRemark: string

    constructor(
        id: number,
        facilityId: string,
        spaceId: string,
        startDate: Timestamp,
        endDate: Timestamp,
        bookedBy: string,
        numOfGuest: number,
        isCancelled: boolean,
        cancelRemark: string,
        status: number,
        createdBy: string,
        updatedBy: string,
        createdDateTime: Timestamp,
        updatedDateTime: Timestamp,
    ){
        super(id, status, createdBy, updatedBy, createdDateTime, updatedDateTime)
        this.facilityId = facilityId;
        this.spaceId = spaceId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.bookedBy = bookedBy;
        this.numOfGuest = numOfGuest;
        this.isCancelled = isCancelled;
        this.cancelRemark = cancelRemark;
    }
}