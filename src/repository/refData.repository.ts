import {
	collection,
} from 'firebase/firestore'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { FirebaseClient } from '../config/initFirebase'
import { Unit } from '../model/refData.model'
import { FirebaseAdmin } from '../config/firebaseAdmin'
import { OperationError } from '../common/operation-error'
import { HttpStatusCode } from '../common/http-status-code'

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

	getPropertyListRepository = async (checkOccupied: boolean) => {
		const propertyDocRef = this.firebaseAdmin.firestore.doc('refData/property')
		const subCollections = await propertyDocRef.listCollections()
		const result: Record<string, Unit[]> = {}
		for (const subCollection of subCollections) {
			const subCollectionName = subCollection.id
			const unitSnapshots = await subCollection.get()
			const units: Unit[] = []
			for (const unitDoc of unitSnapshots.docs) {
				const unit = unitDoc.data() as Unit
				if (unit.isAssigned && checkOccupied) continue
				unit.unitId = unitDoc.id
				units.push(unit)
			}
			units.sort((a, b) => {
				const numA = parseInt(a.unitId ? a.unitId.replace(/\D+/g, '') : "0", 10)
				const numB = parseInt(b.unitId ? b.unitId.replace(/\D+/g, '') : "0", 10)
				return numA - numB
			})
			result[subCollectionName] = units
		}
		return result
	}

	updatePropertyByResidentRepository = async (
		floorId: string,
		unitId: string,
		updatedUnit: Unit,
	) => {
		const propertyDocRef = this.firebaseAdmin.firestore.doc('refData/property')
		const unitDocRef = propertyDocRef.collection(floorId).doc(unitId)
		const unitSnapshot = await unitDocRef.get()
		const unit = unitSnapshot.data() as Unit
		if (!unit) {
			throw new OperationError('Unit not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
		if (unit.isAssigned == true) {
			throw new OperationError('Unit had been occupied', HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
		await unitDocRef.update({
			...updatedUnit,
		})
	}

	getUserGuidByPropertyRepository = async (floor: string, unit: string) => {
		const propertyDocRef = this.firebaseAdmin.firestore.doc('refData/property')
		const unitDocRef = propertyDocRef.collection(floor).doc(unit)
		const unitSnapshot = await unitDocRef.get()
		const unitData = unitSnapshot.data() as Unit
		if (!unitData) {
			throw new OperationError('Unit not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
		if (!unitData.assignedTo || unitData.assignedTo === '') {
			throw new OperationError('Unit not assigned to anyone', HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
		return unitData.assignedTo
	}
}
