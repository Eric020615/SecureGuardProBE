import {
	where,
	orderBy,
	updateDoc,
	collection,
	doc,
	getDoc,
	arrayUnion,
	setDoc,
	addDoc,
	deleteDoc,
} from 'firebase/firestore'
import { FirebaseClient } from '../config/initFirebase'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { DocumentStatusEnum } from '../common/constants'
import { FirebaseAdmin } from '../config/firebaseAdmin'
import { SequenceRepository } from './sequence.repository'
import { RepositoryService } from './repository'
import { Notifications, NotificationTokens } from '../model/notifications.model'

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
		@inject(RepositoryService)
		private repositoryService: RepositoryService,
	) {
		this.notificationTokenCollection = collection(this.firebaseClient.firestore, 'notificationTokens')
		this.notificationCollection = collection(this.firebaseClient.firestore, 'notifications')
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
		const docRef = doc(this.notificationTokenCollection, userGuid)
		const querySnapshot = await getDoc(docRef)
		const data = querySnapshot.data() as NotificationTokens
		return data
	}

	async deleteNotificationTokenRepository(userGuid: string) {
		const docRef = doc(this.notificationTokenCollection, userGuid)
		await deleteDoc(docRef)
	}

	async createNotificationRepository(notification: Notifications) {
		return this.firebaseAdmin.firestore.runTransaction(async (transaction) => {
			const id = await this.sequenceRepository.getSequenceId({
				transaction: transaction,
				counterName: 'notifications',
			})
			if (Number.isNaN(id)) {
				throw new Error('Failed to generate id')
			}
			// can it remove ...?
			const docRef = await addDoc(this.notificationCollection, Object.assign({}, notification))
			await updateDoc(docRef, { id: id })
		})
	}

	async getNotificationRepository(id: number, pageSize: number, userGuid: string) {
		const constraints = [
			where('userGuid', '==', userGuid),
			where('status', '==', DocumentStatusEnum.ACTIVE),
			orderBy('id', 'asc'),
		]
		let { rows, count } = await this.repositoryService.getPaginatedData<Notifications>(
			this.notificationCollection,
			id,
			pageSize,
			constraints,
		)
		return { rows, count }
	}
}
