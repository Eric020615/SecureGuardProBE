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
} from 'firebase/firestore'
import { FirebaseClient } from '../config/initFirebase'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { DocumentStatus } from '../common/constants'

@provideSingleton(NotificationRepository)
export class NotificationRepository {
	private notificationTokenCollection

	constructor(
		@inject(FirebaseClient)
		private firebaseClient: FirebaseClient
	) {
		this.notificationTokenCollection = collection(
			this.firebaseClient.firestore,
			'notificationToken',
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
}
