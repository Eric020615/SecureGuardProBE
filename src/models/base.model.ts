import { Timestamp } from "firebase/firestore";

export class BaseModel { 
    id: number;
    guid?: string;
    createdBy: string;
    updatedBy: string;
    createdDateTime: Timestamp;
    updatedDateTime: Timestamp;

    constructor(
        id: number,
        createdBy: string,
        updatedBy: string,
        createdDateTime: Timestamp,
        updatedDateTime: Timestamp,
    ){
        this.id = id;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.createdDateTime = createdDateTime;
        this.updatedDateTime = updatedDateTime;
    }
}