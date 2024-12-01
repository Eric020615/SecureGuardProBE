import { Timestamp } from "firebase/firestore";
import { DocumentStatusEnum } from "../common/constants";

export class BaseModel { 
    id: number;
    guid?: string;
    status: DocumentStatusEnum;
    createdBy: string;
    updatedBy: string;
    createdDateTime: Timestamp;
    updatedDateTime: Timestamp;

    constructor(
        id: number,
        status: DocumentStatusEnum,
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