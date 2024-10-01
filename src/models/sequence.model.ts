import { Timestamp } from "firebase/firestore";

export class Sequence { 
    sequenceValue: number;

    constructor(
        sequenceValue: number,
    ){
        this.sequenceValue = sequenceValue;
    }
}