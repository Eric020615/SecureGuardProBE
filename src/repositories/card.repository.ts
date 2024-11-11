import { addDoc, and, collection, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { FirebaseClient } from '../config/initFirebase'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { Card } from '../models/card.model'
import { FirebaseAdmin } from '../config/firebaseAdmin'
import { RepositoryService } from './repository'
import { SequenceRepository } from './sequence.repository'

@provideSingleton(CardRepository)
export class CardRepository {
	private cardCollection

	constructor(
		@inject(FirebaseClient)
		private firebaseClient: FirebaseClient,
		@inject(FirebaseAdmin)
		private firebaseAdmin: FirebaseAdmin,
		@inject(RepositoryService)
		private repositoryService: RepositoryService,
		@inject(SequenceRepository)
		private sequenceRepository: SequenceRepository,
	) {
		this.cardCollection = collection(this.firebaseClient.firestore, 'card')
	}

	async createCardRepository(data: Card) {
		return this.firebaseAdmin.firestore.runTransaction(async (transaction) => {
			const id = await this.sequenceRepository.getSequenceId({
				transaction: transaction,
				counterName: 'badgeNumber',
			})
			if (Number.isNaN(id)) {
				throw new Error('Failed to generate id')
			}
			const docRef = await addDoc(this.cardCollection, { ...data })
			await updateDoc(docRef, { badgeNumber: id })
			return id
		})
	}
}
