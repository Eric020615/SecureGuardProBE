import { Timestamp } from "firebase/firestore";

export class Notice { 
    noticeId?: string;
    title: string;
    description: string;
    startDate: Timestamp;
    endDate: Timestamp;
    createdBy: string;
    updatedBy: string;
    createdDateTime: Timestamp;
    updatedDateTime: Timestamp;

    constructor(
        title: string,
        description: string,
        startDate: Timestamp,
        endDate: Timestamp,
        createdBy: string,
        updatedBy: string,
        createdDateTime: Timestamp,
        updatedDateTime: Timestamp,
    ){
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.createdDateTime = createdDateTime;
        this.updatedDateTime = updatedDateTime;
    }
}