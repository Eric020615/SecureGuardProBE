import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getDatabase } from 'firebase/database'
import { getStorage } from 'firebase/storage'
import * as dotenv from 'dotenv'
import { provideSingleton } from '../helper/provideSingleton'

dotenv.config()

@provideSingleton(FirebaseClient)
export class FirebaseClient {
	public app: ReturnType<typeof initializeApp>
	public auth: ReturnType<typeof getAuth>
	public firestore: ReturnType<typeof getFirestore>
	public storage: ReturnType<typeof getStorage>
	public database: ReturnType<typeof getDatabase>
	private firebaseConfig = {
		apiKey: process.env.API_KEY,
		authDomain: process.env.AUTH_DOMAIN,
		projectId: process.env.PROJECT_ID,
		storageBucket: process.env.STORAGE_BUCKET,
		messagingSenderId: process.env.MESSAGING_SENDER_ID,
		appId: process.env.APP_ID,
		measurementId: process.env.MEASUREMENT_ID,
		databaseURL: process.env.DATABASE_URL,
	}

	constructor() {
		// Initialize Firebase
		this.app = initializeApp(this.firebaseConfig)
		this.auth = getAuth(this.app)
		this.firestore = getFirestore(this.app)
		this.storage = getStorage(this.app)
		this.database = getDatabase(this.app)
	}
}