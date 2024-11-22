import { Timestamp } from 'firebase/firestore'

export class Card {
	badgeNumber: number
	status: number
	createdBy: string
	updatedBy: string
	createdDateTime: Timestamp
	updatedDateTime: Timestamp

	constructor(
		badgeNumber: number,
		status: number,
		createdBy: string,
		updatedBy: string,
		createdDateTime: Timestamp,
		updatedDateTime: Timestamp,
	) {
		this.badgeNumber = badgeNumber
		this.status = status
		this.createdBy = createdBy
		this.updatedBy = updatedBy
		this.createdDateTime = createdDateTime
		this.updatedDateTime = updatedDateTime
	}
}
