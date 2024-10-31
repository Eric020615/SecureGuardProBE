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
	createdBy: string
	createdDateTime: string
	updatedBy: string
	updatedDateTime: string
}
