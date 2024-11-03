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
	deleteDoc,
} from 'firebase/firestore'
import { FirebaseClient } from '../config/initFirebase'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { DocumentStatus } from '../common/constants'
import { FirebaseAdmin } from '../config/firebaseAdmin'
import { SequenceRepository } from './sequence.repository'
import { Notification, NotificationToken } from '../models/notification.model'
import { RepositoryService } from './repository'

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
		this.notificationTokenCollection = collection(this.firebaseClient.firestore, 'notificationToken')
		this.notificationCollection = collection(this.firebaseClient.firestore, 'notification')
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
		const data = querySnapshot.data() as NotificationToken
		return data
	}

	async deleteNotificationTokenRepository(userGuid: string) {
		const docRef = doc(this.notificationTokenCollection, userGuid)
		await deleteDoc(docRef)
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

	async getNotificationRepository(id: number, pageSize: number, userGuid: string) {
		const constraints = [
			where('userGuid', '==', userGuid),
			where('status', '==', DocumentStatus.Active),
			orderBy('id', 'asc'),
		]
		let { rows, count } = await this.repositoryService.getPaginatedData<Notification>(
			this.notificationCollection,
			id,
			pageSize,
			constraints,
		)
		return { rows, count }
	}
}
