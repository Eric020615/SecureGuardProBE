import { Timestamp } from "firebase/firestore";
import { BaseModel } from "./base.model";

export class Notice extends BaseModel{ 
    title: string;
    description: string;
    startDate: Timestamp;
    endDate: Timestamp;

    constructor(
        id: number,
        title: string,
        description: string,
        startDate: Timestamp,
        endDate: Timestamp,
        status: number,
        createdBy: string,
        updatedBy: string,
        createdDateTime: Timestamp,
        updatedDateTime: Timestamp,
    ){
        super(id, status, createdBy, updatedBy, createdDateTime, updatedDateTime)
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}