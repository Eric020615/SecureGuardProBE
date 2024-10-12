import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	where,
	updateDoc,
	orderBy,
} from 'firebase/firestore'
import { FirebaseClient } from '../config/initFirebase'
import moment from 'moment-timezone'
import { Visitor } from '../models/visitor.model'
import { convertDateStringToTimestamp } from '../helper/time'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { FirebaseAdmin } from '../config/firebaseAdmin'
import { SequenceRepository } from './sequence.repository'
import { DocumentStatus } from '../common/constants'
import { RepositoryService } from './repository'

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
		@inject(RepositoryService)
		private repositoryService: RepositoryService,
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

	async getVisitorByResidentRepository(
		userId: string,
		isPast: boolean,
		offset: number,
		pageSize: number,
	) {
		const constraints = [
			where('createdBy', '==', userId),
			where(
				'visitDateTime',
				isPast ? '<=' : '>',
				convertDateStringToTimestamp(moment().tz('Asia/Kuala_Lumpur').toISOString()),
			),
			where('status', '==', DocumentStatus.Active),
			orderBy('id', 'asc'),
		]
		let { rows, count } = await this.repositoryService.getPaginatedData<Visitor>(
			this.visitorCollection,
			offset,
			pageSize,
			constraints,
		)
		return { rows, count }
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
