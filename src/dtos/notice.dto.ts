export interface CreateNoticeDto {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
}

export interface UpdateNoticeDto {
    noticeId: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string
}

export interface DeleteNoticeDto {
    noticeId: string;
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