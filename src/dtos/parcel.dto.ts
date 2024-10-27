export interface CreateParcelDto {
	parcelImage: string
	floor: string
	unit: string
}

export interface GetParcelDto {
	parcelId: number
	parcelGuid: string
	parcelImage: string
	floor: string
	unit: string
	createdBy: string
	createdDateTime: string
	updatedBy: string
	updatedDateTime: string
}
