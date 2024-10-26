import { collection, collectionGroup, doc, getDoc, getDocs, query } from 'firebase/firestore'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { FirebaseClient } from '../config/initFirebase'
import { Unit } from '../models/refData.model'
import { FirebaseAdmin } from '../config/firebaseAdmin'

@provideSingleton(RefDataRepository)
export class RefDataRepository {
	private refDataCollection

	constructor(
		@inject(FirebaseClient)
		private firebaseClient: FirebaseClient,
		@inject(FirebaseAdmin)
		private firebaseAdmin: FirebaseAdmin,
	) {
		this.refDataCollection = collection(this.firebaseClient.firestore, 'refData')
	}

	getPropertyListRepository = async () => {
		const propertyDocRef = this.firebaseAdmin.firestore.doc('refData/property')
		const subCollections = await propertyDocRef.listCollections()
		const result: Record<string, Unit[]> = {}
		for (const subCollection of subCollections) {
			const subCollectionName = subCollection.id
			const unitSnapshots = await subCollection.get()
			const units: Unit[] = []
			for (const unitDoc of unitSnapshots.docs) {
				const unit = unitDoc.data() as Unit
				if (unit.isAssigned) continue
				unit.unitId = unitDoc.id
				units.push(unit)
			}
			units.sort((a, b) => {
				const numA = parseInt(a.unitId.replace(/\D+/g, ''), 10)
				const numB = parseInt(b.unitId.replace(/\D+/g, ''), 10)
				return numA - numB
			})
			result[subCollectionName] = units
		}
		return result
	}
}
