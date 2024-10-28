import {
	getDocs,
	query,
	where,
	orderBy,
	updateDoc,
	collection,
	doc,
	getDoc,
	arrayUnion,
	setDoc,
	addDoc,
} from 'firebase/firestore'
import { FirebaseClient } from '../config/initFirebase'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { DocumentStatus } from '../common/constants'
import { FirebaseAdmin } from '../config/firebaseAdmin'
import { SequenceRepository } from './sequence.repository'
import { Notification } from '../models/notification.model'

@provideSingleton(NotificationRepository)
export class NotificationRepository {
	private notificationTokenCollection
	private notificationCollection

	constructor(
		@inject(FirebaseClient)
		private firebaseClient: FirebaseClient,
		@inject(FirebaseAdmin)
		private firebaseAdmin: FirebaseAdmin,
		@inject(SequenceRepository)
		private sequenceRepository: SequenceRepository,
	) {
		this.notificationTokenCollection = collection(
			this.firebaseClient.firestore,
			'notificationToken',
		)
		this.notificationCollection = collection(
			this.firebaseClient.firestore, 
			'notification'
		)
	}

	async createNotificationTokenRepository(token: string, userGuid: string) {
		const docRef = doc(this.notificationTokenCollection, userGuid)
		const docSnap = await getDoc(docRef)
		if (docSnap.exists()) {
			await updateDoc(docRef, {
				tokens: arrayUnion(token),
			})
		} else {
			await setDoc(docRef, { tokens: [token] })
		}
	}

	async getNotificationTokenByUserGuidRepository(userGuid: string) {
		const constraints = [
			where('__name__', '==', userGuid),
			where('status', '==', DocumentStatus.Active),
			orderBy('id', 'asc'),
		]
		const querySnapshot = await getDocs(query(this.notificationTokenCollection, ...constraints))
		const data = querySnapshot.docs.map((doc) => {
			return { ...doc.data(), id: doc.id }
		})
		return data
	}

	async createNotificationRepository(data: Notification) {
		return this.firebaseAdmin.firestore.runTransaction(async (transaction) => {
			const id = await this.sequenceRepository.getSequenceId({
				transaction: transaction,
				counterName: 'notification',
			})
			if (Number.isNaN(id)) {
				throw new Error('Failed to generate id')
			}
			const docRef = await addDoc(this.notificationCollection, { ...data })
			await updateDoc(docRef, { id: id })
		})
	}
}
