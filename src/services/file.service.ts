import { ref, uploadString, getDownloadURL, getStorage } from 'firebase/storage'
import { inject } from 'inversify'
import { FirebaseClient } from '../config/initFirebase' // adjust the path as needed
import { GeneralFileDto } from '../dtos/index.dto'
import { provideSingleton } from '../helper/provideSingleton'
import { FileModel } from '../models/file.model'
import { DocumentStatus } from '../common/constants'
import { getCurrentTimestamp } from '../helper/time'
import { FileRepository } from '../repositories/file.repository'

@provideSingleton(FileService)
export class FileService {
	private storage: ReturnType<typeof getStorage>

	constructor(
		@inject(FirebaseClient)
		private firebaseClient: FirebaseClient, // Inject and persist FirebaseClient
		@inject(FileRepository)
		private fileRepository: FileRepository
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

	public uploadMultipleFiles = async (fileDto: GeneralFileDto[], folderpath: string, userGuid: string, description?: string) => {
		try {
			// Now use this.storage which persists across the method
			const fileURLs = await Promise.all(
				fileDto.map(async (file) => {
					const storageRef = ref(this.storage, `${folderpath}/${file.fileName}`)
					const snapshot = await uploadString(storageRef, file.fileData, 'base64')
					const fileURL = await getDownloadURL(snapshot.ref)
					const fileModel = new FileModel(
						0,
						file.fileName,
						fileURL,
						file.contentType,
						DocumentStatus.Active,
						userGuid,
						userGuid,
						getCurrentTimestamp(),
						getCurrentTimestamp(),
						file.size,
						description
					)
					await this.fileRepository.createFileRepository(fileModel);
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
