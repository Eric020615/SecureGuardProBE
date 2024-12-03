import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { FirebaseClient } from '../config/initFirebase'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { DocumentStatusEnum } from '../common/constants'
import { FirebaseAdmin } from '../config/firebaseAdmin'
import { SequenceRepository } from './sequence.repository'
import { Files } from '../models/files.model'

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

	async createFileRepository(file: Files) {
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
			return fileDoc.data() as Files
		}
		throw new Error('File not found')
	}

	async getFileByGuidRepository(fileGuid: string) {
		const fileDocRef = doc(this.fileCollection, fileGuid)
		const fileDoc = await getDoc(fileDocRef)
		let result: Files = {} as Files
		result = fileDoc.data() as Files
		result.guid = fileDoc.id
		return result
	}

	async getFilesByGuidsRepository(fileGuids: string[]) {
		if (fileGuids.length === 0) {
			return []
		}
		const constraints = [where('__name__', 'in', fileGuids), where('status', '==', DocumentStatusEnum.ACTIVE)]
		const q = query(this.fileCollection, ...constraints)
		const fileSnapshot = await getDocs(q)
		let files: Files[] = []
		fileSnapshot.forEach((doc) => {
			let data = doc.data() as Files
			data.guid = doc.id
			files.push(data)
		})
		return files
	}

	async updateFileByIdRepository(fileGuid: string, file: Partial<Files>) {
		const docRef = doc(this.fileCollection, fileGuid)
		await updateDoc(docRef, { ...file, updatedDateTime: new Date() })
	}

	async deleteFileByIdRepository(fileGuid: string) {
		const docRef = doc(this.fileCollection, fileGuid)
		await updateDoc(docRef, { status: DocumentStatusEnum.SOFT_DELETED })
	}
}
