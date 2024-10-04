import {
	addDoc,
	doc,
	getDocs,
	query,
	where,
	orderBy,
	updateDoc,
	collection,
	getDoc,
	and,
} from 'firebase/firestore'
import { FirebaseClient } from '../config/initFirebase'
import moment from 'moment-timezone'
import { convertDateStringToTimestamp } from '../helper/time'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { FacilityBooking } from '../models/facilityBooking.model'
import { RepositoryService } from './repository'
import { SequenceRepository } from './sequence.repository'
import { FirebaseAdmin } from '../config/firebaseAdmin'
import { DocumentStatus } from '../common/constants'
import { Facility } from '../models/facility.model'
import { SpaceAvailabilityDto } from '../dtos/facility.dto'
import { OperationError } from '../common/operation-error'
import { HttpStatusCode } from '../common/http-status-code'

@provideSingleton(FacilityBookingRepository)
export class FacilityBookingRepository {
	private facilityBookingCollection
	private refDataCollection

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
		this.facilityBookingCollection = collection(this.firebaseClient.firestore, 'facilityBooking')
		this.refDataCollection = collection(
			this.firebaseClient.firestore,
			'refData/facility/information',
		)
	}

	async createFacilityBookingRepository(data: FacilityBooking, userId: string) {
		return this.firebaseAdmin.firestore.runTransaction(async (transaction) => {
			const upcomingBookingsQuery = query(
				this.facilityBookingCollection,
				and(
					where('bookedBy', '==', userId),
					where(
						'startDate',
						'>=',
						convertDateStringToTimestamp(moment().tz('Asia/Kuala_Lumpur').toISOString()),
					),
					where('isCancelled', '==', false),
				),
			)

			const upcomingBookingsSnapshot = await getDocs(upcomingBookingsQuery)

			// Step 2: Check if any upcoming bookings exist
			if (!upcomingBookingsSnapshot.empty) {
				throw new OperationError('You already have an upcoming booking.', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}

			const id = await this.sequenceRepository.getSequenceId({
				transaction: transaction,
				counterName: 'facilityBooking',
			})
			if (Number.isNaN(id)) {
				throw new Error('Failed to generate id')
			}
			const docRef = await addDoc(this.facilityBookingCollection, { ...data })
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
			this.facilityBookingCollection,
			offset,
			pageSize,
			constraints,
		)
		return { rows, count }
	}

	async getAllFacilityBookingRepository(offset: number, pageSize: number) {
		const constraints = [orderBy('id', 'asc')]
		let { rows, count } = await this.repositoryService.getPaginatedData<FacilityBooking>(
			this.facilityBookingCollection,
			offset,
			pageSize,
			constraints,
		)
		return { rows, count }
	}

	async cancelFacilityBookingRepository(data: FacilityBooking, bookingGuid: string) {
		const docRef = doc(this.facilityBookingCollection, bookingGuid)
		await updateDoc(docRef, { ...data })
	}

	async checkFacilitySlotRepository(
		facilityId: string,
		startDate: string,
		duration: number,
	): Promise<SpaceAvailabilityDto[]> {
		const endDate = moment(startDate).add(duration, 'hours').format('YYYY-MM-DD HH:mm')
		const facilityDocRef = doc(this.refDataCollection, facilityId)
		const facilityDoc = await getDoc(facilityDocRef)
		let result: Facility = {} as Facility
		result = facilityDoc.data() as Facility
		const bookedSpaces = await Promise.all(
			result.spaces.map(async (space) => {
				const q = query(
					this.facilityBookingCollection,
					and(
						where('facilityId', '==', facilityId),
						where('spaceId', '==', space.id),
						where('isCancelled', '==', false), // Exclude cancelled bookings
						where(
							'startDate',
							'<',
							convertDateStringToTimestamp(moment(endDate).tz('Asia/Kuala_Lumpur').toISOString()),
						),
						where(
							'endDate',
							'>',
							convertDateStringToTimestamp(moment(startDate).tz('Asia/Kuala_Lumpur').toISOString()),
						),
					),
				)
				const bookingsSnapshot = await getDocs(q)
				return {
					spaceId: space.id,
					spaceName: space.name,
					capacity: space.capacity,
					isBooked: !bookingsSnapshot.empty, // Check if the space has bookings
				}
			}),
		)
		return bookedSpaces // Return the booking status for each space
	}
}
