export interface CreateVisitorDto {
    visitorName: string;
    visitorCategory: string;
    visitorContactNumber: string;
    visitDateTime: string;
}

export interface EditVisitorByIdDto {
    visitorId: string;
    visitorName: string;
    visitorCategory: string;
    visitorContactNumber: string;
    visitDateTime: string;
}

export interface GetVisitorDto {
    visitorId: string;
    visitorName: string;
    visitorCategory: string;
    visitorContactNumber: string;
    visitDateTime: string;
    createdBy: string;
    updatedBy: string;
    createdDateTime: string;
    updatedDateTime: string;
}