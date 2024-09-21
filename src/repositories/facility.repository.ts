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
import { convertDateStringToTimestamp } from '../helper/time'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { FacilityBooking } from '../models/facilityBooking.mode'

@provideSingleton(FacilityBookingRepository)
export class FacilityBookingRepository {
	private facilityCollection

	constructor(private firebaseClient: FirebaseClient) {
		this.firebaseClient = new FirebaseClient()
		this.facilityCollection = collection(this.firebaseClient.firestore, 'facilityBooking')
	}

	async createFacilityBookingRepository(data: FacilityBooking) {
		await addDoc(this.facilityCollection, Object.assign({}, data))
	}

	async getFacilityBookingRepository(userId: string, isPast: boolean) {
		const q = query(
			this.facilityCollection,
			and(
				where('bookedBy', '==', userId),
				where(
					'startDate',
					isPast ? '<=' : '>',
					convertDateStringToTimestamp(moment().tz('Asia/Kuala_Lumpur').toISOString()),
				),
			),
		)
		const querySnapshot = await getDocs(q)
		let result: FacilityBooking[] = []
		querySnapshot.forEach((doc) => {
			let data = doc.data() as FacilityBooking
			data.bookingId = doc.id
			result.push(data)
		})
		return result
	}

	async getAllFacilityBookingRepository() {
		const q = query(this.facilityCollection)
		const querySnapshot = await getDocs(q)
		let result: FacilityBooking[] = []
		querySnapshot.forEach((doc) => {
			let data = doc.data() as FacilityBooking
			data.bookingId = doc.id
			result.push(data)
		})
		return result
	}

	async cancelFacilityBookingRepository(data: FacilityBooking, bookingId: string) {
		const docRef = doc(this.facilityCollection, bookingId)
		await updateDoc(docRef, { ...data })
	}
}
