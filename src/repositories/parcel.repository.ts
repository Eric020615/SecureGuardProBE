import { addDoc, collection, orderBy, updateDoc, where } from 'firebase/firestore'
import { FirebaseClient } from '../config/initFirebase'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { FirebaseAdmin } from '../config/firebaseAdmin'
import { SequenceRepository } from './sequence.repository'
import { RepositoryService } from './repository'
import { Parcel } from '../models/parcel.model'
import { DocumentStatus } from '../common/constants'

@provideSingleton(ParcelRepository)
export class ParcelRepository {
	private parcelCollection

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
		this.parcelCollection = collection(this.firebaseClient.firestore, 'parcel')
	}

	async createParcelRepository(parcel: Parcel) {
		return this.firebaseAdmin.firestore.runTransaction(async (transaction) => {
			const id = await this.sequenceRepository.getSequenceId({
				transaction: transaction,
				counterName: 'parcel',
			})
			if (Number.isNaN(id)) {
				throw new Error('Failed to generate id')
			}
			const docRef = await addDoc(this.parcelCollection, Object.assign({}, parcel))
			await updateDoc(docRef, { id: id })
		})
	}

	async getParcelByResidentRepository(id: number, pageSize: number, floor: string, unit: string) {
		const constraints = [
			where('floor', '==', floor),
			where('unit', '==', unit),
			where('status', '==', DocumentStatus.Active),
			orderBy('id', 'asc'),
		]
		let { rows, count } = await this.repositoryService.getPaginatedData<Parcel>(
			this.parcelCollection,
			id,
			pageSize,
			constraints,
		)
		return { rows, count }
	}
}
