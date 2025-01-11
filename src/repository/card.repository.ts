import { addDoc, and, collection, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { FirebaseClient } from '../config/initFirebase'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { Cards } from '../model/cards.model'
import { FirebaseAdmin } from '../config/firebaseAdmin'
import { SequenceRepository } from './sequence.repository'
import { DocumentStatusEnum } from '../common/constants'

@provideSingleton(CardRepository)
export class CardRepository {
	private cardCollection

	constructor(
		@inject(FirebaseClient)
		private firebaseClient: FirebaseClient,
		@inject(FirebaseAdmin)
		private firebaseAdmin: FirebaseAdmin,
		@inject(SequenceRepository)
		private sequenceRepository: SequenceRepository,
	) {
		this.cardCollection = collection(this.firebaseClient.firestore, 'cards')
	}

	async createCardRepository(data: Cards) {
		return this.firebaseAdmin.firestore.runTransaction(async (transaction) => {
			const id = await this.sequenceRepository.getSequenceId({
				transaction: transaction,
				counterName: 'badgeNumbers',
			})
			if (Number.isNaN(id)) {
				throw new Error('Failed to generate id')
			}
			const docRef = await addDoc(this.cardCollection, { ...data })
			await updateDoc(docRef, { badgeNumber: id })
			return id
		})
	}

	async getCardByReferalUidRepository(referralUid: String) {
		try {
			const cardsQuery = query(
				this.cardCollection,
				and(where('referralUid', '==', referralUid), where('status', '==', DocumentStatusEnum.ACTIVE)),
			)
	
			const cardsSnapshot = await getDocs(cardsQuery)
			return cardsSnapshot
		} catch (error) {
			console.log(error)
		}
	}
}
