export interface CreateNoticeDto {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
}

export interface UpdateNoticeDto {
    title: string;
    description: string;
    startDate: string;
    endDate: string
}

export interface GetNoticeDto {
    noticeId: string
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    createdBy: string;
    createdDateTime: string;
    updatedBy: string;
    updatedDateTime: string;
}