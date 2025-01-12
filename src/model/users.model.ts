import { Timestamp } from 'firebase/firestore'
import { BaseModel } from './base.model'
import { DocumentStatusEnum, GenderEnum, RoleEnum } from '../common/constants'

export class Users extends BaseModel {
	firstName: string
	lastName: string
	contactNumber: string
	gender: GenderEnum
	dateOfBirth: Timestamp | null
	role: RoleEnum
	badgeNumber: string
	supportedDocuments: string[]

	constructor(
		id: number,
		firstName: string,
		lastName: string,
		contactNumber: string,
		gender: GenderEnum,
		dateOfBirth: Timestamp | null,
		role: RoleEnum,
		badgeNumber: string,
		supportedDocuments: string[],
		status: DocumentStatusEnum,
		createdBy: string,
		updatedBy: string,
		createdDateTime: Timestamp,
		updatedDateTime: Timestamp,
	) {
		super(id, status, createdBy, updatedBy, createdDateTime, updatedDateTime)
		this.firstName = firstName
		this.lastName = lastName
		this.contactNumber = contactNumber
		this.gender = gender
		this.dateOfBirth = dateOfBirth
		this.role = role
		this.badgeNumber = badgeNumber
		this.supportedDocuments = supportedDocuments
	}
}

export class SubUsers {
	id?: string
	parentUserGuid: string
	createdBy: string
	updatedBy: string
	createdDateTime: Timestamp
	updatedDateTime: Timestamp

	constructor(
		parentUserGuid: string,
		createdBy: string,
		updatedBy: string,
		createdDateTime: Timestamp,
		updatedDateTime: Timestamp,
	) {
		this.parentUserGuid = parentUserGuid
		this.createdBy = createdBy
		this.updatedBy = updatedBy
		this.createdDateTime = createdDateTime
		this.updatedDateTime = updatedDateTime
	}
}

export class SubUserRequests extends BaseModel {
	email: string
	parentUserGuid: string

	constructor(
		id: number,
		email: string,
		parentUserGuid: string,
		status: DocumentStatusEnum,
		createdBy: string,
		updatedBy: string,
		createdDateTime: Timestamp,
		updatedDateTime: Timestamp,
	) {
		super(id, status, createdBy, updatedBy, createdDateTime, updatedDateTime)
		this.email = email
		this.parentUserGuid = parentUserGuid
	}
}

export class Residents {
	id?: string
	floor: string
	unit: string
	createdBy: string
	updatedBy: string
	createdDateTime: Timestamp
	updatedDateTime: Timestamp

	constructor(
		floor: string,
		unit: string,
		createdBy: string,
		updatedBy: string,
		createdDateTime: Timestamp,
		updatedDateTime: Timestamp,
	) {
		this.floor = floor
		this.unit = unit
		this.createdBy = createdBy
		this.updatedBy = updatedBy
		this.createdDateTime = createdDateTime
		this.updatedDateTime = updatedDateTime
	}
}

export class Staffs {
	id?: string
	staffId: string
	isAdmin: boolean
	createdBy: string
	updatedBy: string
	createdDateTime: Timestamp
	updatedDateTime: Timestamp

	constructor(
		staffId: string,
		isAdmin: boolean,
		createdBy: string,
		updatedBy: string,
		createdDateTime: Timestamp,
		updatedDateTime: Timestamp,
	) {
		this.staffId = staffId
		this.isAdmin = isAdmin
		this.createdBy = createdBy
		this.updatedBy = updatedBy
		this.createdDateTime = createdDateTime
		this.updatedDateTime = updatedDateTime
	}
}
