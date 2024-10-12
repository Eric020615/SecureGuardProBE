import {
	addDoc,
	collection,
	doc,
	getDoc,
	where,
	orderBy,
	updateDoc,
} from 'firebase/firestore'
import { FirebaseClient } from '../config/initFirebase'
import moment from 'moment-timezone'
import { Notice } from '../models/notice.model'
import { convertDateStringToTimestamp } from '../helper/time'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { FirebaseAdmin } from '../config/firebaseAdmin'
import { SequenceRepository } from './sequence.repository'
import { DocumentStatus } from '../common/constants'
import { RepositoryService } from './repository'

@provideSingleton(NoticeRepository)
export class NoticeRepository {
	private noticeCollection

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
		this.noticeCollection = collection(this.firebaseClient.firestore, 'notice')
	}

	async createNoticeRepository(notice: Notice) {
		return this.firebaseAdmin.firestore.runTransaction(async (transaction) => {
			const id = await this.sequenceRepository.getSequenceId({
				transaction: transaction,
				counterName: 'notice',
			})
			if (Number.isNaN(id)) {
				throw new Error('Failed to generate id')
			}
			const docRef = await addDoc(this.noticeCollection, Object.assign({}, notice))
			await updateDoc(docRef, { id: id })
		})
	}

	async getAllNoticeRepository(offset: number, pageSize: number) {
		const constraints = [
			orderBy('id', 'asc')
		]
		let { rows, count } = await this.repositoryService.getPaginatedData<Notice>(
			this.noticeCollection,
			offset,
			pageSize,
			constraints,
		)
		return { rows, count }
	}

	async getNoticeRepository(offset: number, pageSize: number) {
		const constraints = [
			where(
				'startDate',
				'<=',
				convertDateStringToTimestamp(moment().tz('Asia/Kuala_Lumpur').toISOString()),
			),
			where(
				'endDate',
				'>',
				convertDateStringToTimestamp(moment().tz('Asia/Kuala_Lumpur').toISOString()),
			),
			where('status', '==', DocumentStatus.Active),
			orderBy('id', 'asc'),
		]
		let { rows, count } = await this.repositoryService.getPaginatedData<Notice>(
			this.noticeCollection,
			offset,
			pageSize,
			constraints,
		)
		return { rows, count }
	}

	async getNoticeByIdRepository(noticeGuid: string) {
		const noticeDocRef = doc(this.noticeCollection, noticeGuid)
		const noticeDoc = await getDoc(noticeDocRef)
		let result: Notice = {} as Notice
		result = noticeDoc.data() as Notice
		return result
	}

	async editNoticeByIdRepository(noticeGuid: string, notice: Notice) {
		const docRef = doc(this.noticeCollection, noticeGuid)
		await updateDoc(docRef, { ...notice })
	}

	async deleteNoticeByIdRepository(noticeGuid: string) {
		const docRef = doc(this.noticeCollection, noticeGuid)
		await updateDoc(docRef, { status: DocumentStatus.SoftDeleted })
	}
}
