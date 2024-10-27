import { ref, uploadString, getDownloadURL, getStorage } from 'firebase/storage'
import { inject } from 'inversify'
import { FirebaseClient } from '../config/initFirebase' // adjust the path as needed
import { GeneralFileDto } from '../dtos/index.dto'
import { provideSingleton } from '../helper/provideSingleton'

@provideSingleton(FileService)
export class FileService {
	private storage: ReturnType<typeof getStorage>

	constructor(
		@inject(FirebaseClient)
		private firebaseClient: FirebaseClient, // Inject and persist FirebaseClient
	) {
		this.storage = this.firebaseClient.storage // Store the storage instance
	}

	public uploadFile = async (file: string, folderpath: string, contentType: string) => {
		try {
			const storageRef = ref(this.storage, `${folderpath}`)
			const snapshot = await uploadString(storageRef, file, 'base64', {
				contentType: contentType,
			})
			const fileURL = await getDownloadURL(snapshot.ref)
			return fileURL
		} catch (error) {
			console.error(error)
			throw new Error('File upload failed')
		}
	}

	public uploadMultipleFiles = async (files: GeneralFileDto[], folderpath: string) => {
		try {
			// Now use this.storage which persists across the method
			const fileURLs = await Promise.all(
				files.map(async (file) => {
					const storageRef = ref(this.storage,  `${folderpath}/${file.fileName}}`)
					const snapshot = await uploadString(storageRef, file.data, 'base64')
					const fileURL = await getDownloadURL(snapshot.ref)
					return fileURL
				}),
			)
			return fileURLs
		} catch (error) {
			console.error(error)
			throw new Error('File upload failed')
		}
	}
}
