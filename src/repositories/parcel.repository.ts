import { addDoc, collection, doc, getDoc, orderBy, updateDoc, where } from 'firebase/firestore'
import { FirebaseClient } from '../config/initFirebase'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { FirebaseAdmin } from '../config/firebaseAdmin'
import { SequenceRepository } from './sequence.repository'
import { RepositoryService } from './repository'
import { DocumentStatusEnum } from '../common/constants'
import { getCurrentTimestamp } from '../helper/time'
import { Parcels } from '../models/parcels.model'

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
		this.parcelCollection = collection(this.firebaseClient.firestore, 'parcels')
	}

	async createParcelRepository(parcel: Parcels) {
		return this.firebaseAdmin.firestore.runTransaction(async (transaction) => {
			const id = await this.sequenceRepository.getSequenceId({
				transaction: transaction,
				counterName: 'parcels',
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
			where('status', '==', DocumentStatusEnum.ACTIVE),
			orderBy('id', 'asc'),
		]
		let { rows, count } = await this.repositoryService.getPaginatedData<Parcels>(
			this.parcelCollection,
			id,
			pageSize,
			constraints,
		)
		return { rows, count }
	}

	async getParcelByStaffRepository(id: number, pageSize: number, userGuid: string) {
		const constraints = [
			where('createdBy', '==', userGuid),
			orderBy('id', 'asc'),
		]
		let { rows, count } = await this.repositoryService.getPaginatedData<Parcels>(
			this.parcelCollection,
			id,
			pageSize,
			constraints,
		)
		return { rows, count }
	}

	async getParcelDetailsByIdRepository(parcelGuid: string) {
		const parcelDocRef = doc(this.parcelCollection, parcelGuid)
		const parcelDoc = await getDoc(parcelDocRef)
		let result: Parcels = {} as Parcels
		result = parcelDoc.data() as Parcels
		result.guid = parcelDoc.id
		return result
	}

	async deleteParcelByResidentRepository(parcelGuid: string) {
		const docRef = doc(this.parcelCollection, parcelGuid)
		await updateDoc(docRef, { status: DocumentStatusEnum.SOFT_DELETED, updatedDateTime: getCurrentTimestamp() })
	}
}
