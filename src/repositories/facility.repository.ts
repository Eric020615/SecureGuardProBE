import {
	addDoc,
	doc,
	getDocs,
	query,
	where,
	orderBy,
	updateDoc,
	collection,
} from 'firebase/firestore'
import { FirebaseClient } from '../config/initFirebase'
import moment from 'moment-timezone'
import { convertDateStringToTimestamp } from '../helper/time'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { FacilityBooking } from '../models/facilityBooking.mode'
import { RepositoryService } from './repository'

@provideSingleton(FacilityBookingRepository)
export class FacilityBookingRepository {
	private facilityCollection

	constructor(
		@inject(FirebaseClient)
		private firebaseClient: FirebaseClient,
		@inject(RepositoryService)
		private repositoryService: RepositoryService,
	) {
		this.facilityCollection = collection(this.firebaseClient.firestore, 'facilityBooking')
	}

	async createFacilityBookingRepository(data: FacilityBooking) {
		await addDoc(this.facilityCollection, Object.assign({}, data))
	}

	async getFacilityBookingRepository(
		userId: string,
		isPast: boolean,
		startAt: string,
		pageSize: number,
	) {
    const constraints = [
      where('bookedBy', '==', userId),
			where(
				'startDate',
				isPast ? '<=' : '>',
				convertDateStringToTimestamp(moment().tz('Asia/Kuala_Lumpur').toISOString()),
			),
      orderBy('startDate', 'asc')
    ]
		let { rows, count } = await this.repositoryService.getPaginatedData<FacilityBooking>(
			this.facilityCollection,
			startAt,
			pageSize,
      constraints
		)
		return { rows, count }
	}

	async getAllFacilityBookingRepository() {
		const q = query(this.facilityCollection)
		const querySnapshot = await getDocs(q)
		let result: FacilityBooking[] = []
		querySnapshot.forEach((doc) => {
			let data = doc.data() as FacilityBooking
			data.id = doc.id
			result.push(data)
		})
		return result
	}

	async cancelFacilityBookingRepository(data: FacilityBooking, bookingId: string) {
		const docRef = doc(this.facilityCollection, bookingId)
		await updateDoc(docRef, { ...data })
	}
}
