import { addDoc, collection, doc, getDoc, where, orderBy, updateDoc } from 'firebase/firestore'
import { FirebaseClient } from '../config/initFirebase'
import moment from 'moment-timezone'
import { convertDateStringToTimestamp } from '../helper/time'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { FirebaseAdmin } from '../config/firebaseAdmin'
import { SequenceRepository } from './sequence.repository'
import { DocumentStatusEnum, PaginationDirectionEnum } from '../common/constants'
import { RepositoryService } from './repository'
import { Notices } from '../models/notices.model'

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
		this.noticeCollection = collection(this.firebaseClient.firestore, 'notices')
	}

	async createNoticeRepository(notice: Notices) {
		return this.firebaseAdmin.firestore.runTransaction(async (transaction) => {
			const id = await this.sequenceRepository.getSequenceId({
				transaction: transaction,
				counterName: 'notices',
			})
			if (Number.isNaN(id)) {
				throw new Error('Failed to generate id')
			}
			const docRef = await addDoc(this.noticeCollection, Object.assign({}, notice))
			await updateDoc(docRef, { id: id })
			return docRef.id
		})
	}

	async getNoticeByAdminRepository(direction: PaginationDirectionEnum, id: number, pageSize: number) {
		const constraints = [orderBy('id', 'asc')]
		let { rows, count } = await this.repositoryService.getPaginatedData<Notices>(
			this.noticeCollection,
			id,
			pageSize,
			constraints,
			direction,
		)
		return { rows, count }
	}

	async getNoticeRepository(id: number, pageSize: number) {
		const constraints = [
			where('startDate', '<=', convertDateStringToTimestamp(moment().tz('Asia/Kuala_Lumpur').toISOString())),
			where('endDate', '>', convertDateStringToTimestamp(moment().tz('Asia/Kuala_Lumpur').toISOString())),
			where('status', '==', DocumentStatusEnum.Active),
			orderBy('id', 'asc'),
		]
		let { rows, count } = await this.repositoryService.getPaginatedData<Notices>(
			this.noticeCollection,
			id,
			pageSize,
			constraints,
		)
		return { rows, count }
	}

	async getNoticeDetailsByIdRepository(noticeGuid: string) {
		const noticeDocRef = doc(this.noticeCollection, noticeGuid)
		const noticeDoc = await getDoc(noticeDocRef)
		let result: Notices = {} as Notices
		result = noticeDoc.data() as Notices
		return result
	}

	async editNoticeByIdRepository(noticeGuid: string, notice: Notices) {
		const docRef = doc(this.noticeCollection, noticeGuid)
		await updateDoc(docRef, { ...notice })
	}

	async deleteNoticeByIdRepository(noticeGuid: string) {
		const docRef = doc(this.noticeCollection, noticeGuid)
		await updateDoc(docRef, { status: DocumentStatusEnum.SoftDeleted })
	}
}
