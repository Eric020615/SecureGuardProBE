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
import { DocumentStatus, PaginationDirection } from '../common/constants'
import { Facility } from '../models/facility.model'
import { SpaceAvailabilityDto } from '../dtos/facility.dto'

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

	async createFacilityBookingRepository(data: FacilityBooking) {
		return this.firebaseAdmin.firestore.runTransaction(async (transaction) => {
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
		lastId: number,
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
			lastId,
			pageSize,
			constraints,
		)
		return { rows, count }
	}

	async getFacilityBookingHistoryByAdminRepository (direction: PaginationDirection, id: number, pageSize: number) {
		const constraints = [orderBy('id', 'asc')]
		let { rows, count } = await this.repositoryService.getPaginatedData<FacilityBooking>(
			this.facilityBookingCollection,
			id,
			pageSize,
			constraints,
			direction,
		)
		return { rows, count }
	}

	async getFacilityBookingDetailsByFacilityBookingGuidRepository(
		facilityBookingGuid: string,
	) {
		const facilityBookingDocRef = doc(this.facilityBookingCollection, facilityBookingGuid)
		const facilityBookingDoc = await getDoc(facilityBookingDocRef)
		let result: FacilityBooking = {} as FacilityBooking
		result = facilityBookingDoc.data() as FacilityBooking
		return result
	}

	async cancelFacilityBookingRepository(data: FacilityBooking, bookingGuid: string) {
		const docRef = doc(this.facilityBookingCollection, bookingGuid)
		await updateDoc(docRef, { ...data })
	}

	async checkUpcomingBookingRepository(userId: string) {
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
		return !upcomingBookingsSnapshot.empty
	}

	async checkFacilitySlotRepository(
		facilityId: string,
		startDate: string,
		endDate: string,
		spaceId?: string,
	): Promise<SpaceAvailabilityDto[] | SpaceAvailabilityDto> {
		const facilityDocRef = doc(this.refDataCollection, facilityId)
		const facilityDoc = await getDoc(facilityDocRef)
		let result: Facility = facilityDoc.data() as Facility

		// Case 1: If spaceId is provided, return the availability for that specific space
		if (spaceId) {
			const space = result.spaces.find((space) => space.id === spaceId)
			if (!space) {
				throw new Error(`Space with ID ${spaceId} not found`)
			}

			const q = query(
				this.facilityBookingCollection,
				and(
					where('facilityId', '==', facilityId),
					where('spaceId', '==', spaceId),
					where('isCancelled', '==', false), // Exclude cancelled bookings
					where('startDate', '<', convertDateStringToTimestamp(endDate)),
					where('endDate', '>', convertDateStringToTimestamp(startDate)),
				),
			)
			const bookingsSnapshot = await getDocs(q)

			return {
				spaceId: space.id,
				spaceName: space.name,
				capacity: space.capacity,
				isBooked: !bookingsSnapshot.empty, // Check if the space has bookings
			} as SpaceAvailabilityDto
		}

		// Case 2: If spaceId is not provided, return the availability for all spaces
		const bookedSpaces = await Promise.all(
			result.spaces.map(async (space) => {
				const q = query(
					this.facilityBookingCollection,
					and(
						where('facilityId', '==', facilityId),
						where('spaceId', '==', space.id),
						where('isCancelled', '==', false), // Exclude cancelled bookings
						where('startDate', '<', convertDateStringToTimestamp(endDate)),
						where('endDate', '>', convertDateStringToTimestamp(startDate)),
					),
				)
				const bookingsSnapshot = await getDocs(q)

				return {
					spaceId: space.id,
					spaceName: space.name,
					capacity: space.capacity,
					isBooked: !bookingsSnapshot.empty, // Check if the space has bookings
				} as SpaceAvailabilityDto
			}),
		)

		return bookedSpaces // Return the booking status for all spaces
	}
}
