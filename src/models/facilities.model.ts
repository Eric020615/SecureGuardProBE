import { Timestamp } from 'firebase/firestore'
import { BaseModel } from './base.model'
import { DocumentStatusEnum, FacilityEnum } from '../common/constants'

export class Facilities {
	facilityName?: FacilityEnum
	image: string
	name: string
	spaces: {
		id: string
		name: string
		capacity: number
	}[]

	constructor(
		image: string,
		name: string,
		spaces: {
			id: string
			name: string
			capacity: number
		}[],
	) {
		this.image = image
		this.name = name
		this.spaces = spaces
	}
}

export class FacilityBookings extends BaseModel {
	facilityName: FacilityEnum
	spaceName: string
	startDate: Timestamp
	endDate: Timestamp
	bookedBy: string
	numOfGuest: number
	isCancelled: boolean
	cancelRemark: string

	constructor(
		id: number,
		facilityName: FacilityEnum,
		spaceName: string,
		startDate: Timestamp,
		endDate: Timestamp,
		bookedBy: string,
		numOfGuest: number,
		isCancelled: boolean,
		cancelRemark: string,
		status: DocumentStatusEnum,
		createdBy: string,
		updatedBy: string,
		createdDateTime: Timestamp,
		updatedDateTime: Timestamp,
	) {
		super(id, status, createdBy, updatedBy, createdDateTime, updatedDateTime)
		this.facilityName = facilityName
		this.spaceName = spaceName
		this.startDate = startDate
		this.endDate = endDate
		this.bookedBy = bookedBy
		this.numOfGuest = numOfGuest
		this.isCancelled = isCancelled
		this.cancelRemark = cancelRemark
	}
}
