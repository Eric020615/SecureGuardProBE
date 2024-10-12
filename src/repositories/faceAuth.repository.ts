import { collection, doc, setDoc } from 'firebase/firestore'
import { FirebaseClient } from '../config/initFirebase'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { FaceAuth } from '../models/faceAuth.model'

@provideSingleton(FaceAuthRepository)
export class FaceAuthRepository {
	private faceAuthCollection

	constructor(
		@inject(FirebaseClient)
		private firebaseClient: FirebaseClient,
	) {
		this.faceAuthCollection = collection(this.firebaseClient.firestore, 'faceAuth')
	}

	async createFaceAuthRepository(id: string, data: FaceAuth) {
		const faceAuthDocRef = doc(this.faceAuthCollection, id)
		await setDoc(faceAuthDocRef, { ...data })
	}
}
