import { DocumentStatusEnum, VisitorCategoryEnum } from '../common/constants'

export interface CreateVisitorDto {
	visitorName: string
	visitorEmail: string
	visitorCategory: keyof typeof VisitorCategoryEnum
	visitorContactNumber: string
	visitDateTime: string
}

export interface EditVisitorByIdDto {
	visitorName: string
	visitorEmail: string
	visitorCategory: keyof typeof VisitorCategoryEnum
	visitorContactNumber: string
	visitDateTime: string
}

export interface GetVisitorDto {
	visitorId: number
	visitorGuid: string
	visitorName: string
	visitorEmail: string
	visitorCategory: keyof typeof VisitorCategoryEnum
	visitorContactNumber: string
	visitDateTime: string
	status: keyof typeof DocumentStatusEnum
}

export interface GetVisitorDetailsDto {
	visitorId: number
	visitorGuid: string
	visitorName: string
	visitorEmail: string
	visitorCategory: keyof typeof VisitorCategoryEnum
	visitorContactNumber: string
	visitDateTime: string
	token: string
	status: keyof typeof DocumentStatusEnum
	createdBy: string
	updatedBy: string
	createdDateTime: string
	updatedDateTime: string
}

export interface GetVisitorByDateDto {
	date: string
	count: number
}

export interface GetVisitorPassDetailsDto {
	visitorId: number
	visitorGuid: string
	visitorName: string
	visitorEmail: string
	visitorCategory: keyof typeof VisitorCategoryEnum
	visitorContactNumber: string
	visitDateTime: string
}

export interface GetVisitorDetailsByTokenDto {
	visitorId: number
	visitorGuid: string
	visitorName: string
	visitorEmail: string
	visitorCategory: keyof typeof VisitorCategoryEnum
	visitorContactNumber: string
	visitDateTime: string
}
