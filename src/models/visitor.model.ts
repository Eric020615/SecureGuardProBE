import { Timestamp } from "firebase/firestore";

export class Visitor { 
    visitorId?: string;
    visitorName: string;
    visitorCategory: string;
    visitorContactNumber: string;
    visitDateTime: Timestamp;
    createdBy: string;
    updatedBy: string;
    createdDateTime: Timestamp;
    updatedDateTime: Timestamp;

    constructor(
        visitorName: string,
        visitorCategory: string,
        visitorContactNumber: string,
        visitDateTime: Timestamp,
        createdBy: string,
        updatedBy: string,
        createdDateTime: Timestamp,
        updatedDateTime: Timestamp,
    ){
        this.visitorName = visitorName;
        this.visitorCategory = visitorCategory,
        this.visitorContactNumber = visitorContactNumber,
        this.visitDateTime = visitDateTime,
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.createdDateTime = createdDateTime;
        this.updatedDateTime = updatedDateTime;
    }
}