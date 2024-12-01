import { Timestamp } from 'firebase/firestore'
import { BaseModel } from './base.model'
import { DocumentStatusEnum, ParcelStatusEnum } from '../common/constants'

export class Parcels extends BaseModel {
	parcelImage: string
	floor: string
	unit: string
	parcelStatus: ParcelStatusEnum

	constructor(
		id: number,
		parcelImage: string,
		floor: string,
		unit: string,
		parcelStatus: ParcelStatusEnum,
		status: DocumentStatusEnum,
		createdBy: string,
		updatedBy: string,
		createdDateTime: Timestamp,
		updatedDateTime: Timestamp,
	) {
		super(id, status, createdBy, updatedBy, createdDateTime, updatedDateTime)
		this.parcelImage = parcelImage
		this.floor = floor
		this.unit = unit
		this.parcelStatus = parcelStatus
	}
}
