export interface CreateVisitorDto {
    visitorName: string;
    visitorCategory: string;
    visitorContactNumber: string;
    visitDateTime: string;
}

export interface EditVisitorByIdDto {
    visitorName: string;
    visitorCategory: string;
    visitorContactNumber: string;
    visitDateTime: string;
}

export interface GetVisitorDto {
    visitorId: number;
    visitorGuid: string;
    visitorName: string;
    visitorCategory: string;
    visitorContactNumber: string;
    visitDateTime: string;
    createdBy: string;
    updatedBy: string;
    createdDateTime: string;
    updatedDateTime: string;
}