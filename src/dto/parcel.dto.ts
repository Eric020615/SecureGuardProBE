import { DocumentStatusEnum, ParcelStatusEnum } from "../common/constants"
import { GeneralFileDto, GeneralFileResponseDto } from "./index.dto"

export interface CreateParcelDto {
	parcelImage: GeneralFileDto
	floor: string
	unit: string
}

export interface GetParcelDto {
	parcelId: number
	parcelGuid: string
	parcelImage: GeneralFileResponseDto
	floor: string
	unit: string
	createdDateTime: string
}

export interface GetParcelDetailsDto {
	parcelId: number
	parcelGuid: string
	parcelImage: GeneralFileResponseDto
	floor: string
	unit: string
	parcelStatus: keyof typeof ParcelStatusEnum
	status: keyof typeof DocumentStatusEnum
	createdBy: string
	createdDateTime: string
	updatedBy: string
	updatedDateTime: string
}