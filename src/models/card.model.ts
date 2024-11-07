import { Timestamp } from "firebase/firestore";
import { BaseModel } from "./base.model"

export class Card extends BaseModel { 
    badgeNumber: number

    constructor(
        id: number,
        badgeNumber: number,
        status: number,
        createdBy: string,
        updatedBy: string,
        createdDateTime: Timestamp,
        updatedDateTime: Timestamp,
    ){
        super(id, status, createdBy, updatedBy, createdDateTime, updatedDateTime)
        this.badgeNumber = badgeNumber
    }
}