import {
	CollectionReference as Client,
	getDocs,
	limit,
	query,
	startAfter,
	doc,
	getDoc,
	QueryConstraint,
	getCountFromServer,
	startAt,
} from 'firebase/firestore'
import { BaseModel } from '../models/base.model'
import { provideTransient } from '../helper/provideSingleton'

@provideTransient(RepositoryService)
export class RepositoryService {
	constructor() {}

	public async getPaginatedData<T extends BaseModel>(
		collection: Client,
		offset: number,
		pageSize: number,
		constraints: QueryConstraint[],
	): Promise<{ rows: T[]; count: number }> {
		try {
			let q = null
			q = query(collection, ...constraints, limit(pageSize), startAt(offset))
			const querySnapshot = await getDocs(q)
			let rows: T[] = []
			querySnapshot.forEach((doc) => {
				let data = doc.data() as T
				data.guid = doc.id
				rows.push(data)
			})
			const countQuery = query(collection, ...constraints)
			const totalSnapshot = await getCountFromServer(countQuery)
			const count = totalSnapshot.data().count
			return { rows, count }
		} catch (error) {
			console.log(error)
			return { rows: [], count: 0 } // Ensure correct structure here
		}
	}
}
