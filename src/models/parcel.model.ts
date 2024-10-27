import { Timestamp } from 'firebase/firestore'
import { BaseModel } from './base.model'

export class Parcel extends BaseModel {
	parcelImageUrl: string
	floor: string
	unit: string

	constructor(
		id: number,
		parcelImageUrl: string,
		floor: string,
		unit: string,
		status: number,
		createdBy: string,
		updatedBy: string,
		createdDateTime: Timestamp,
		updatedDateTime: Timestamp,
	) {
		super(id, status, createdBy, updatedBy, createdDateTime, updatedDateTime)
        this.parcelImageUrl = parcelImageUrl
        this.floor = floor
        this.unit = unit
	}
}
