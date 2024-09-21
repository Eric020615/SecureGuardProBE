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

@provideSingleton(VisitorRepository)
export class VisitorRepository {
	private visitorCollection

	constructor(
		@inject(FirebaseClient)
		private firebaseClient: FirebaseClient,
	) {
		this.visitorCollection = collection(this.firebaseClient.firestore, 'visitor')
	}

	async createVisitorRepository(visitor: Visitor) {
		await addDoc(this.visitorCollection, Object.assign({}, visitor))
	}

	async editVisitorByIdRepository(visitor: Visitor) {
		const docRef = doc(this.visitorCollection, visitor.visitorId)
		await updateDoc(docRef, { ...visitor })
	}

	async getVisitorListRepository() {
		const q = query(this.visitorCollection)
		const querySnapshot = await getDocs(q)
		let result: Visitor[] = []
		querySnapshot.forEach((doc) => {
			let data = doc.data() as Visitor
			data.visitorId = doc.id
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
			data.visitorId = doc.id
			result.push(data)
		})
		return result
	}

	async getVisitorDetailsByResidentRepository(visitorId: string) {
		const visitorDocRef = doc(this.visitorCollection, visitorId)
		const visitorDoc = await getDoc(visitorDocRef)
		let result: Visitor = {} as Visitor
		result = visitorDoc.data() as Visitor
		result.visitorId = visitorDoc.id
		return result
	}

	async getAllVisitorsRepository() {
		const q = query(this.visitorCollection)
		const querySnapshot = await getDocs(q)
		let result: Visitor[] = []
		querySnapshot.forEach((doc) => {
			let data = doc.data() as Visitor
			data.visitorId = doc.id
			result.push(data)
		})
		return result
	}
}
