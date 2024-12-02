import { Timestamp } from "firebase/firestore";
import { BaseModel } from "./base.model";
import { DocumentStatusEnum, VisitorCategoryEnum, VisitStatusEnum } from "../common/constants";

export class Visitors extends BaseModel{ 
    visitorName: string;
    visitorEmail: string;
    visitorCategory: VisitorCategoryEnum;
    visitorContactNumber: string;
    visitDateTime: Timestamp;
    badgeNumber: string;
    token: string;
    visitStatus: VisitStatusEnum;

    constructor(
        id: number,
        visitorName: string,
        visitorEmail: string,
        visitorCategory: VisitorCategoryEnum,
        visitorContactNumber: string,
        visitDateTime: Timestamp,
        badgeNumber: string,
        token: string,
        visitStatus: VisitStatusEnum,
        status: DocumentStatusEnum,
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
        this.visitDateTime = visitDateTime,
        this.badgeNumber = badgeNumber,
        this.token = token
        this.visitStatus = visitStatus
    }
}