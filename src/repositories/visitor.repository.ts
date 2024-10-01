import {
	addDoc,
	and,
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	where,
	updateDoc,
} from 'firebase/firestore'
import { FirebaseClient } from '../config/initFirebase'
import moment from 'moment-timezone'
import { Visitor } from '../models/visitor.model'
import { convertDateStringToTimestamp } from '../helper/time'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { FirebaseAdmin } from '../config/firebaseAdmin'
import { SequenceRepository } from './sequence.repository'

@provideSingleton(VisitorRepository)
export class VisitorRepository {
	private visitorCollection

	constructor(
		@inject(FirebaseClient)
		private firebaseClient: FirebaseClient,
		@inject(FirebaseAdmin)
		private firebaseAdmin: FirebaseAdmin,
		@inject(SequenceRepository)
		private sequenceRepository: SequenceRepository,
	) {
		this.visitorCollection = collection(this.firebaseClient.firestore, 'visitor')
	}

	async createVisitorRepository(visitor: Visitor) {
		return this.firebaseAdmin.firestore.runTransaction(async (transaction) => {
			const id = await this.sequenceRepository.getSequenceId({
				transaction: transaction,
				counterName: 'visitor',
			})
			if (Number.isNaN(id)) {
				throw new Error('Failed to generate id')
			}
			const docRef = await addDoc(this.visitorCollection, Object.assign({}, visitor))
			await updateDoc(docRef, { id: id })
		})
	}

	async editVisitorByIdRepository(visitorGuid: string, visitor: Visitor) {
		const docRef = doc(this.visitorCollection, visitorGuid)
		await updateDoc(docRef, { ...visitor })
	}

	async getVisitorListRepository() {
		const q = query(this.visitorCollection)
		const querySnapshot = await getDocs(q)
		let result: Visitor[] = []
		querySnapshot.forEach((doc) => {
			let data = doc.data() as Visitor
			data.guid = doc.id
			result.push(data)
		})
		return result
	}

	async getVisitorByResidentRepository(userId: string, isPast: boolean) {
		const q = query(
			this.visitorCollection,
			and(
				where('createdBy', '==', userId),
				where(
					'visitDateTime',
					isPast ? '<=' : '>',
					convertDateStringToTimestamp(moment().tz('Asia/Kuala_Lumpur').toISOString()),
				),
			),
		)
		const querySnapshot = await getDocs(q)
		let result: Visitor[] = []
		querySnapshot.forEach((doc) => {
			let data = doc.data() as Visitor
			data.guid = doc.id
			result.push(data)
		})
		return result
	}

	async getVisitorDetailsByResidentRepository(visitorGuid: string) {
		const visitorDocRef = doc(this.visitorCollection, visitorGuid)
		const visitorDoc = await getDoc(visitorDocRef)
		let result: Visitor = {} as Visitor
		result = visitorDoc.data() as Visitor
		result.guid = visitorDoc.id
		return result
	}

	async getAllVisitorsRepository() {
		const q = query(this.visitorCollection)
		const querySnapshot = await getDocs(q)
		let result: Visitor[] = []
		querySnapshot.forEach((doc) => {
			let data = doc.data() as Visitor
			data.guid = doc.id
			result.push(data)
		})
		return result
	}
}
