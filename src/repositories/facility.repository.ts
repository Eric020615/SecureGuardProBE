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
import { SequenceRepository } from './sequence.repository'
import { FirebaseAdmin } from '../config/firebaseAdmin'
import { DocumentStatus } from '../common/constants'

@provideSingleton(FacilityBookingRepository)
export class FacilityBookingRepository {
	private facilityCollection

	constructor(
		@inject(FirebaseClient)
		private firebaseClient: FirebaseClient,
		@inject(FirebaseAdmin)
		private firebaseAdmin: FirebaseAdmin,
		@inject(RepositoryService)
		private repositoryService: RepositoryService,
		@inject(SequenceRepository)
		private sequenceRepository: SequenceRepository,
	) {
		this.facilityCollection = collection(this.firebaseClient.firestore, 'facilityBooking')
	}

	async createFacilityBookingRepository(data: FacilityBooking) {
		return this.firebaseAdmin.firestore.runTransaction(async (transaction) => {
			const id = await this.sequenceRepository.getSequenceId({
				transaction: transaction,
				counterName: 'facilityBooking',
			})
			if (Number.isNaN(id)) {
				throw new Error('Failed to generate id')
			}
			const docRef = await addDoc(this.facilityCollection, { ...data })
			await updateDoc(docRef, { id: id })
		})
	}

	async getFacilityBookingRepository(
		userId: string,
		isPast: boolean,
		offset: number,
		pageSize: number,
	) {
		const constraints = [
			where('bookedBy', '==', userId),
			where(
				'startDate',
				isPast ? '<=' : '>',
				convertDateStringToTimestamp(moment().tz('Asia/Kuala_Lumpur').toISOString()),
			),
			where('status', '==', DocumentStatus.Active),
			orderBy('id', 'asc'),
		]
		let { rows, count } = await this.repositoryService.getPaginatedData<FacilityBooking>(
			this.facilityCollection,
			offset,
			pageSize,
			constraints,
		)
		return { rows, count }
	}

	async getAllFacilityBookingRepository(offset: number, pageSize: number) {
		const constraints = [orderBy('id', 'asc')]
		let { rows, count } = await this.repositoryService.getPaginatedData<FacilityBooking>(
			this.facilityCollection,
			offset,
			pageSize,
			constraints,
		)
		return { rows, count }
	}

	async cancelFacilityBookingRepository(data: FacilityBooking, bookingGuid: string) {
		const docRef = doc(this.facilityCollection, bookingGuid)
		await updateDoc(docRef, { ...data })
	}
}
