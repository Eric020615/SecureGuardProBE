import {
	addDoc,
	and,
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	where,
	orderBy,
	updateDoc,
	deleteDoc,
} from 'firebase/firestore'
import { FirebaseClient } from '../config/initFirebase'
import moment from 'moment-timezone'
import { Notice } from '../models/notice.model'
import { convertDateStringToTimestamp } from '../helper/time'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'

@provideSingleton(NoticeRepository)
export class NoticeRepository {
	private noticeCollection

	constructor(
		private firebaseClient: FirebaseClient
	) {
    this.firebaseClient = new FirebaseClient()
		this.noticeCollection = collection(this.firebaseClient.firestore, 'notice')
	}

	async createNoticeRepository(notice: Notice) {
		await addDoc(this.noticeCollection, Object.assign({}, notice))
	}

	async getAllNoticeRepository() {
		const q = query(this.noticeCollection)
		const querySnapshot = await getDocs(q)
		let result: Notice[] = []
		querySnapshot?.forEach((doc) => {
			let data = doc.data() as Notice
			data.noticeId = doc.id
			result.push(data)
		})
		return result
	}

	async getNoticeRepository() {
		const q = query(
			this.noticeCollection,
			and(
				where('startDate', '<=', convertDateStringToTimestamp(moment().tz('Asia/Kuala_Lumpur').toISOString())),
				where('endDate', '>', convertDateStringToTimestamp(moment().tz('Asia/Kuala_Lumpur').toISOString()))
			),
			orderBy('startDate')
		)
		const querySnapshot = await getDocs(q)
		let result: Notice[] = []
		querySnapshot?.forEach((doc) => {
			let data = doc.data() as Notice
			data.noticeId = doc.id
			result.push(data)
		})
		return result
	}

	async getNoticeByIdRepository(id: string) {
		const noticeDocRef = doc(this.noticeCollection, id)
		const noticeDoc = await getDoc(noticeDocRef)
		let result: Notice = {} as Notice
		result = noticeDoc.data() as Notice
		result.noticeId = noticeDoc.id
		return result
	}

	async editNoticeByIdRepository(id: string, notice: Notice) {
		const docRef = doc(this.noticeCollection, id)
		await updateDoc(docRef, { ...notice })
	}

	async deleteNoticeByIdRepository(id: string) {
		const docRef = doc(this.noticeCollection, id)
		await deleteDoc(docRef)
	}
}
