import { Timestamp } from 'firebase/firestore'
import { RoleEnum } from '../common/role'
import { DocumentStatusEnum } from '../common/constants'

export class Cards {
	badgeNumber: number
	referralUid: string
	role: RoleEnum
	status: DocumentStatusEnum
	createdBy: string
	updatedBy: string
	createdDateTime: Timestamp
	updatedDateTime: Timestamp

	constructor(
		badgeNumber: number,
		referralUid: string,
		role: RoleEnum,
		status: DocumentStatusEnum,
		createdBy: string,
		updatedBy: string,
		createdDateTime: Timestamp,
		updatedDateTime: Timestamp,
	) {
		this.badgeNumber = badgeNumber
		this.referralUid = referralUid
		this.role = role
		this.status = status
		this.createdBy = createdBy
		this.updatedBy = updatedBy
		this.createdDateTime = createdDateTime
		this.updatedDateTime = updatedDateTime
	}
}
