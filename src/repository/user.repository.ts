import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	where,
	orderBy,
	updateDoc,
	setDoc,
} from 'firebase/firestore'
import { FirebaseClient } from '../config/initFirebase'
import 'moment-timezone'
import { Residents, SubUsers, SubUserRequests, Staffs, Users } from '../model/users.model'
import { UserRecord } from 'firebase-admin/auth'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { FirebaseAdmin } from '../config/firebaseAdmin'
import { SequenceRepository } from './sequence.repository'
import { RepositoryService } from './repository'
import { DocumentStatusEnum, PaginationDirectionEnum } from '../common/constants'

@provideSingleton(UserRepository)
export class UserRepository {
	private userCollection
	private subUserRequestCollection
	private subUserCollection
	private residentCollection
	private staffCollection

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
		this.userCollection = collection(this.firebaseClient.firestore, 'users')
		this.subUserRequestCollection = collection(this.firebaseClient.firestore, 'subUserRequests')
		this.subUserCollection = collection(this.firebaseClient.firestore, 'subUsers')
		this.residentCollection = collection(this.firebaseClient.firestore, 'residents')
		this.staffCollection = collection(this.firebaseClient.firestore, 'staffs')
	}

	createResidentRepository = async (user: Users, resident: Residents, userId: string) => {
		return this.firebaseAdmin.firestore.runTransaction(async (transaction) => {
			const id = await this.sequenceRepository.getSequenceId({
				transaction: transaction,
				counterName: 'users',
			})
			if (Number.isNaN(id)) {
				throw new Error('Failed to generate id')
			}
			const userDocRef = doc(this.userCollection, userId)
			const residentDocRef = doc(this.residentCollection, userId)
			await setDoc(userDocRef, { ...user })
			await setDoc(residentDocRef, { ...resident })
			await updateDoc(userDocRef, { id: id })
		})
	}

	createStaffRepository = async (user: Users, staff: Staffs, userId: string) => {
		return this.firebaseAdmin.firestore.runTransaction(async (transaction) => {
			const id = await this.sequenceRepository.getSequenceId({
				transaction: transaction,
				counterName: 'users',
			})
			if (Number.isNaN(id)) {
				throw new Error('Failed to generate id')
			}
			const userDocRef = doc(this.userCollection, userId)
			const staffDocRef = doc(this.staffCollection, userId)
			await setDoc(userDocRef, { ...user })
			await setDoc(staffDocRef, { ...staff })
			await updateDoc(userDocRef, { id: id })
		})
	}

	createSubUserRepository = async (user: Users, subUser: SubUsers, userGuid: string) => {
		return this.firebaseAdmin.firestore.runTransaction(async (transaction) => {
			const userId = await this.sequenceRepository.getSequenceId({
				transaction: transaction,
				counterName: 'users',
			})
			if (Number.isNaN(userId)) {
				throw new Error('Failed to generate id')
			}
			const userDocRef = doc(this.userCollection, userGuid)
			const subUserDocRef = doc(this.subUserCollection, userGuid)
			await setDoc(userDocRef, { ...user })
			await setDoc(subUserDocRef, { ...subUser })
			await updateDoc(userDocRef, { id: userId })
		})
	}

	getUserByIdRepository = async (userGuid: string) => {
		const docRef = doc(this.userCollection, userGuid)
		const userDoc = await getDoc(docRef)
		let result: Users = {} as Users
		result = userDoc.data() as Users
		result.guid = userDoc.id
		return result
	}

	getUserListByAdminRepository = async (userList: UserRecord[], direction: PaginationDirectionEnum, id: number, pageSize: number) => {
		const userGuid = userList.map((user) => user.uid)
		if (userGuid.length === 0) {
			return { rows: [], count: 0 }
		}
		const constraints = [
			where('__name__', 'in', userGuid),
			orderBy('id', 'asc'),
		]
		let { rows, count } = await this.repositoryService.getPaginatedData<Users>(
			this.userCollection,
			id,
			pageSize,
			constraints,
			direction
		)
		return { rows, count }
	}

	getFacilityBookingUserRepository = async (userList: UserRecord[]) => {
		const userGuid = userList.map((user) => user.uid)
		if (userGuid.length === 0) {
			return []
		}
		const constraints = [
			where('__name__', 'in', userGuid),
			orderBy('id', 'asc'),
		]
		const q = query(this.userCollection, ...constraints)
		const querySnapshot = await getDocs(q)
		let result: Users[] = []
		querySnapshot.forEach((doc) => {
			let data = doc.data() as Users
			data.guid = doc.id
			result.push(data)
		})
		return result
	}

	getResidentDetailsRepository = async (userId: string) => {
		const docRef = doc(this.residentCollection, userId)
		const resDoc = await getDoc(docRef)
		let result: Residents = {} as Residents
		result = resDoc.data() as Residents
		return result
	}

	getStaffDetailsRepository = async (userId: string) => {
		const docRef = doc(this.staffCollection, userId)
		const resDoc = await getDoc(docRef)
		let result: Staffs = {} as Staffs
		result = resDoc.data() as Staffs
		return result
	}

	updateUserStatusByIdRepository = async (id: string, user: Users) => {
		const docRef = doc(this.userCollection, id)
		await updateDoc(docRef, { ...user })
	}

	editUserDetailsByIdRepository = async (id: string, user: Users) => {
		const docRef = doc(this.userCollection, id)
		await updateDoc(docRef, { ...user })
	}

	createSubUserRequestRepository = async (data: SubUserRequests) => {
		const id = await this.firebaseAdmin.firestore.runTransaction(async (transaction) => {
			const id = await this.sequenceRepository.getSequenceId({
				transaction: transaction,
				counterName: 'subUserRequests',
			})
			if (Number.isNaN(id)) {
				throw new Error('Failed to generate id')
			}
			const subUserRequestDocRef = await addDoc(this.subUserRequestCollection, { ...data })
			await updateDoc(subUserRequestDocRef, { id: id })
			return subUserRequestDocRef.id
		})
		return id
	}

	getSubUserParentUserGuidByUserGuidRepository = async (userGuid: string) => {
		const subUserDocRef = doc(this.subUserCollection, userGuid)
		const subUserDoc = await getDoc(subUserDocRef)
		let result: SubUsers = {} as SubUsers
		result = subUserDoc.data() as SubUsers
		return result
	}

	getSubUserListByResidentRepository = async (
		userGuid: string,
		id: number,
		pageSize: number,
	) => {
		if (!userGuid) {
			return { rows: [], count: 0 }
		}
		const subUserConstraints = [where('parentUserGuid', '==', userGuid)]
		const querySnapshot = await getDocs(query(this.subUserCollection, ...subUserConstraints))
		let subUser: string[] = []
		querySnapshot.forEach((doc) => {
			subUser.push(doc.id)
		})
		if (subUser.length === 0) {
			return { rows: [], count: 0 }
		}
		const constraints = [
			where('__name__', 'in', subUser),
			where('status', '==', DocumentStatusEnum.ACTIVE),
			orderBy('id', 'asc'),
		]
		let { rows, count } = await this.repositoryService.getPaginatedData<Users>(
			this.userCollection,
			id,
			pageSize,
			constraints,
		)
		return { rows, count }
	}

	getSubUserRequestByEmailRepository = async (email: string) => {
		const constraints = [
			where('email', '==', email),
			where('status', '!=', DocumentStatusEnum.SOFT_DELETED),
			orderBy('id', 'asc'),
		]
		const q = query(this.subUserRequestCollection, ...constraints)
		const querySnapshot = await getDocs(q)
		let result: SubUserRequests[] = []
		querySnapshot.forEach((doc) => {
			let data = doc.data() as SubUserRequests
			data.guid = doc.id
			result.push(data)
		})
		return result
	}

	editSubUserRequestRepository = async (
		subUserRequestGuid: string,
		subUserRequest: SubUserRequests,
	) => {
		const docRef = doc(this.subUserRequestCollection, subUserRequestGuid)
		await updateDoc(docRef, { ...subUserRequest })
	}

	editSubUserByIdRepository = async (subUserGuid: string, subUser: SubUsers, user: Users) => {
		const subUserDocRef = doc(this.subUserCollection, subUserGuid)
		await updateDoc(subUserDocRef, { ...subUser })
		const userDocRef = doc(this.userCollection, subUserGuid)
		await updateDoc(userDocRef, { ...user })
	}


}
