import { RoleEnum } from '../common/role'
import { Timestamp } from 'firebase/firestore'
import { BaseModel } from './base.model'
import { DocumentStatusEnum } from '../common/constants'

export class Users extends BaseModel {
	firstName: string
	lastName: string
	contactNumber: string
	gender: string
	dateOfBirth: Timestamp | null
	role: RoleEnum
	badgeNumber: string

	constructor(
		id: number,
		firstName: string,
		lastName: string,
		contactNumber: string,
		gender: string,
		dateOfBirth: Timestamp | null,
		role: RoleEnum,
		badgeNumber: string,
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
	unit: string
	floor: string
	createdBy: string
	updatedBy: string
	createdDateTime: Timestamp
	updatedDateTime: Timestamp
	supportedDocuments: string[]

	constructor(
		unit: string,
		floor: string,
		createdBy: string,
		updatedBy: string,
		createdDateTime: Timestamp,
		updatedDateTime: Timestamp,
		supportedDocuments: string[],
	) {
		this.unit = unit
		this.floor = floor
		this.createdBy = createdBy
		this.updatedBy = updatedBy
		this.createdDateTime = createdDateTime
		this.updatedDateTime = updatedDateTime
		this.supportedDocuments = supportedDocuments
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
	supportedDocuments: string[]

	constructor(
		staffId: string,
		isAdmin: boolean,
		createdBy: string,
		updatedBy: string,
		createdDateTime: Timestamp,
		updatedDateTime: Timestamp,
		supportedDocuments: string[],
	) {
		this.staffId = staffId
		this.isAdmin = isAdmin
		this.createdBy = createdBy
		this.updatedBy = updatedBy
		this.createdDateTime = createdDateTime
		this.updatedDateTime = updatedDateTime
		this.supportedDocuments = supportedDocuments
	}
}
