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
	setDoc,
} from 'firebase/firestore'
import { FirebaseClient } from '../config/initFirebase'
import 'moment-timezone'
import { Resident, SystemAdmin, User } from '../models/user.model'
import { UserRecord } from 'firebase-admin/auth'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'

@provideSingleton(UserRepository)
export class UserRepository {
	private userCollection
	private residentCollection
	private systemAdminCollection

	constructor(
    @inject(FirebaseClient)
    private firebaseClient: FirebaseClient
  ) {
		this.userCollection = collection(this.firebaseClient.firestore, 'user')
		this.residentCollection = collection(this.firebaseClient.firestore, 'resident')
		this.systemAdminCollection = collection(this.firebaseClient.firestore, 'systemAdmin')
	}

	createResidentRepository = async (user: User, resident: Resident, userId: string) => {
		const userDocRef = doc(this.userCollection, userId)
		const residentDocRef = doc(this.residentCollection, userId)
		await setDoc(userDocRef, { ...user })
		await setDoc(residentDocRef, { ...resident })
	}

	createSystemAdminRepository = async (user: User, systemAdmin: SystemAdmin, userId: string) => {
		const userDocRef = doc(this.userCollection, userId)
		const systemAdminDocRef = doc(this.systemAdminCollection, userId)
		await setDoc(userDocRef, { ...user })
		await setDoc(systemAdminDocRef, { ...systemAdmin })
	}

	GetUserByIdRepository = async (userId: string) => {
		const docRef = doc(this.userCollection, userId)
		const userDoc = await getDoc(docRef)
		let result: User = {} as User
		result = userDoc.data() as User
		result.id = userDoc.id
		return result
	}

	GetUserListRepository = async (userList: UserRecord[]) => {
		const userDocsPromise = userList.map(async (user) => {
			const userDoc = await getDoc(doc(this.userCollection, user.uid))
			if (userDoc.exists()) {
				return userDoc
			}
			return null
		})
		let result: User[] = []
		let userDocs = (await Promise.all(userDocsPromise)).filter((doc) => doc != null)
		result = userDocs.map((doc) => {
			let user = doc.data() as User
			user.id = doc.id
			return user
		})
		return result
	}

	GetResidentDetailsRepository = async (userId: string) => {
		const docRef = doc(this.residentCollection, userId)
		const resDoc = await getDoc(docRef)
		let result: Resident = {} as Resident
		result = resDoc.data() as Resident
		return result
	}

	GetSystemAdminDetailsRepository = async (userId: string) => {
		const docRef = doc(this.systemAdminCollection, userId)
		const resDoc = await getDoc(docRef)
		let result: SystemAdmin = {} as SystemAdmin
		result = resDoc.data() as SystemAdmin
		return result
	}

	updateUserStatusByIdRepository = async (id: string, user: User) => {
		const docRef = doc(this.userCollection, id)
		await updateDoc(docRef, { ...user })
	}

	editUserDetailsByIdRepository = async (id: string, user: User) => {
		const docRef = doc(this.userCollection, id)
		await updateDoc(docRef, { ...user })
	}
}
