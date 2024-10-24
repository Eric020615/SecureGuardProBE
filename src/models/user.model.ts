import { RoleEnum } from '../common/role'
import { Timestamp } from 'firebase/firestore'
import { BaseModel } from './base.model'

export class User extends BaseModel {
	firstName: string
	lastName: string
	contactNumber: string
	gender: string
	dateOfBirth: Timestamp | null
	role: RoleEnum

	constructor(
		id: number,
		firstName: string,
		lastName: string,
		contactNumber: string,
		gender: string,
		dateOfBirth: Timestamp | null,
		role: RoleEnum,
		status: number,
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
	}
}

export class SubUser {
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

export class SubUserRequest extends BaseModel {
	email: string
	parentUserGuid: string

	constructor(
		id: number,
		email: string,
		parentUserGuid: string,
		status: number,
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

export class Resident {
	id?: string
	unitNumber: string
	floorNumber: string
	createdBy: string
	updatedBy: string
	createdDateTime: Timestamp
	updatedDateTime: Timestamp
	supportedDocumentUrl: string[]

	constructor(
		unitNumber: string,
		floorNumber: string,
		createdBy: string,
		updatedBy: string,
		createdDateTime: Timestamp,
		updatedDateTime: Timestamp,
		supprtedDocumentUrl: string[],
	) {
		this.unitNumber = unitNumber
		this.floorNumber = floorNumber
		this.createdBy = createdBy
		this.updatedBy = updatedBy
		this.createdDateTime = createdDateTime
		this.updatedDateTime = updatedDateTime
		this.supportedDocumentUrl = supprtedDocumentUrl
	}
}

export class Staff {
	id?: string
	staffId: string
	isAdmin: boolean
	createdBy: string
	updatedBy: string
	createdDateTime: Timestamp
	updatedDateTime: Timestamp
	supportedDocumentUrl: string[]

	constructor(
		staffId: string,
		isAdmin: boolean,
		createdBy: string,
		updatedBy: string,
		createdDateTime: Timestamp,
		updatedDateTime: Timestamp,
		supprtedDocumentUrl: string[],
	) {
		this.staffId = staffId
		this.isAdmin = isAdmin
		this.createdBy = createdBy
		this.updatedBy = updatedBy
		this.createdDateTime = createdDateTime
		this.updatedDateTime = updatedDateTime
		this.supportedDocumentUrl = supprtedDocumentUrl
	}
}
