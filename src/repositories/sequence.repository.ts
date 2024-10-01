import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { CollectionReference, Transaction } from 'firebase-admin/firestore'
import { FirebaseAdmin } from '../config/firebaseAdmin'
import { Sequence } from '../models/sequence.model'
import { getNowTimestamp } from '../helper/time'

export interface incrementParams {
	transaction: Transaction
	counterName: string
	path?: CollectionReference
	startAt?: number
	incrementValue?: number
}

@provideSingleton(SequenceRepository)
export class SequenceRepository {
	constructor(
		@inject(FirebaseAdmin)
		private firebaseAdmin: FirebaseAdmin,
	) {}

	async getSequenceId(args: incrementParams) {
		let result = args.startAt ?? 1
		const counterRef = this.firebaseAdmin.firestore.doc(`sequence/${args.counterName}`)
		const counterDoc = await args.transaction.get(counterRef)
		if (counterDoc.exists) {
			const { sequenceValue } = counterDoc.data() as Sequence
			result = sequenceValue + (args.incrementValue ?? 1)
			args.transaction.update(counterRef, { sequenceValue: result })
		} else {
			args.transaction.create(counterRef, { sequenceValue: result })
		}
		return result
	}
}
