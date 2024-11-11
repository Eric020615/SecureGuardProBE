import { Timestamp } from "firebase/firestore";
import { BaseModel } from "./base.model";

export class Visitor extends BaseModel{ 
    visitorName: string;
    visitorEmail: string;
    visitorCategory: string;
    visitorContactNumber: string;
    visitDateTime: Timestamp;

    constructor(
        id: number,
        visitorName: string,
        visitorEmail: string,
        visitorCategory: string,
        visitorContactNumber: string,
        visitDateTime: Timestamp,
        status: number,
        createdBy: string,
        updatedBy: string,
        createdDateTime: Timestamp,
        updatedDateTime: Timestamp,
    ){
        super(id, status, createdBy, updatedBy, createdDateTime, updatedDateTime)
        this.visitorName = visitorName;
        this.visitorEmail = visitorEmail;
        this.visitorCategory = visitorCategory,
        this.visitorContactNumber = visitorContactNumber,
        this.visitDateTime = visitDateTime
    }
}