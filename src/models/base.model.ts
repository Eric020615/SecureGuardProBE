import { Timestamp } from "firebase/firestore";
import { DocumentStatus } from "../common/constants";

export class BaseModel { 
    id: number;
    guid?: string;
    status: DocumentStatus;
    createdBy: string;
    updatedBy: string;
    createdDateTime: Timestamp;
    updatedDateTime: Timestamp;

    constructor(
        id: number,
        status: number,
        createdBy: string,
        updatedBy: string,
        createdDateTime: Timestamp,
        updatedDateTime: Timestamp,
    ){
        this.id = id;
        this.status = status;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.createdDateTime = createdDateTime;
        this.updatedDateTime = updatedDateTime;
    }
}