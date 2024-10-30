import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore'
import { FirebaseClient } from '../config/initFirebase'
import { FileModel } from '../models/file.model'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { DocumentStatus } from '../common/constants'
import { FirebaseAdmin } from '../config/firebaseAdmin'
import { SequenceRepository } from './sequence.repository'

@provideSingleton(FileRepository)
export class FileRepository {
	private fileCollection

	constructor(
		@inject(FirebaseClient)
		private firebaseClient: FirebaseClient,
		@inject(FirebaseAdmin)
		private firebaseAdmin: FirebaseAdmin,
		@inject(SequenceRepository)
		private sequenceRepository: SequenceRepository,
	) {
		this.fileCollection = collection(this.firebaseClient.firestore, 'files')
	}

	async createFileRepository(file: FileModel) {
		return this.firebaseAdmin.firestore.runTransaction(async (transaction) => {
			const id = await this.sequenceRepository.getSequenceId({
				transaction: transaction,
				counterName: 'files',
			})
			if (Number.isNaN(id)) {
				throw new Error('Failed to generate id')
			}
			const docRef = await addDoc(this.fileCollection, Object.assign({}, file))
			await updateDoc(docRef, { id: id })
			return docRef.id
		})
	}

	async getFileRepository(fileGuid: string) {
		const fileDocRef = doc(this.fileCollection, fileGuid)
		const fileDoc = await getDoc(fileDocRef)
		if (fileDoc.exists()) {
			return fileDoc.data() as FileModel
		}
		throw new Error('File not found')
	}

	async updateFileByIdRepository(fileGuid: string, file: Partial<FileModel>) {
		const docRef = doc(this.fileCollection, fileGuid)
		await updateDoc(docRef, { ...file, updatedDateTime: new Date() })
	}

	async deleteFileByIdRepository(fileGuid: string) {
		const docRef = doc(this.fileCollection, fileGuid)
		await updateDoc(docRef, { status: DocumentStatus.SoftDeleted })
	}
}
