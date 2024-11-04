import { GeneralFileDto, GeneralFileResponseDto } from "./index.dto"

export interface CreateNoticeDto {
	title: string
	description: string
	startDate: string
	endDate: string
	attachments: GeneralFileDto[]
}

export interface EditNoticeDto {
	title: string
	description: string
	startDate: string
	endDate: string
	deletedAttachments?: string[]
	newAttachments?: GeneralFileDto[]
}

export interface DeleteNoticeDto {
	noticeGuid: string
}

export interface GetNoticeDto {
    noticeId: number
    noticeGuid: string
    title: string
    description: string
    startDate: string
    endDate: string
    status: string
}

export interface GetNoticeDetailsDto {
	noticeId: number
	noticeGuid: string
	title: string
	description: string
	startDate: string
	endDate: string
	attachments: GeneralFileResponseDto[]
	status: string
	createdBy: string
	createdDateTime: string
	updatedBy: string
	updatedDateTime: string
}
