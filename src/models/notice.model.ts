export class Notice { 
    noticeId?: string;
    title: string;
    description: string;
    startDate: number;
    endDate: number;
    createdBy: string;
    updatedBy: string;
    createdDateTime: number;
    updatedDateTime: number;

    constructor(
        title: string,
        description: string,
        startDate: number,
        endDate: number,
        createdBy: string,
        updatedBy: string,
        createdDateTime: number,
        updatedDateTime: number,
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