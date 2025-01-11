import { Timestamp } from 'firebase/firestore'
import { BaseModel } from './base.model'
import { DocumentStatusEnum, FacilityEnum } from '../common/constants'

export class Facilities {
	facilityId?: FacilityEnum
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
	facility: FacilityEnum
	space: string
	startDate: Timestamp
	endDate: Timestamp
	bookedBy: string
	numOfGuest: number
	isCancelled: boolean
	cancelRemark: string

	constructor(
		id: number,
		facility: FacilityEnum,
		space: string,
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
		this.facility = facility
		this.space = space
		this.startDate = startDate
		this.endDate = endDate
		this.bookedBy = bookedBy
		this.numOfGuest = numOfGuest
		this.isCancelled = isCancelled
		this.cancelRemark = cancelRemark
	}
}
