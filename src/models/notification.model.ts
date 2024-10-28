import { Timestamp } from 'firebase/firestore'
import { BaseModel } from './base.model'

export class NotificationToken {
	tokens: string[]

	constructor(tokens: string[]) {
		this.tokens = tokens
	}
}

export class Notification extends BaseModel {
	userGuid: string
	title: string
	body: string
	data: any
	isRead: boolean

	constructor(
		id: number,
		userGuid: string,
		title: string,
		body: string,
		data: any,
		isRead: boolean,
		status: number,
		createdBy: string,
		updatedBy: string,
		createdDateTime: Timestamp,
		updatedDateTime: Timestamp,
	) {
		super(id, status, createdBy, updatedBy, createdDateTime, updatedDateTime)
		this.userGuid = userGuid
		this.title = title
		this.body = body
		this.data = data
		this.isRead = isRead
	}
}
