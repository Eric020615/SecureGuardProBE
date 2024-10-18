import { DocumentStatus } from '../common/constants'

export interface CreateVisitorDto {
	visitorName: string
	visitorCategory: string
	visitorContactNumber: string
	visitDateTime: string
}

export interface EditVisitorByIdDto {
	visitorName: string
	visitorCategory: string
	visitorContactNumber: string
	visitDateTime: string
}

export interface GetVisitorDto {
	visitorId: number
	visitorGuid: string
	visitorName: string
	visitorCategory: string
	visitorContactNumber: string
	visitDateTime: string
	status: DocumentStatus
	createdBy: string
	updatedBy: string
	createdDateTime: string
	updatedDateTime: string
}

export interface GetVisitorByDateDto {
	date: string
	count: number
}
