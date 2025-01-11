import {
	CollectionReference as Client,
	getDocs,
	limit,
	query,
	QueryConstraint,
	getCountFromServer,
	startAfter,
	endBefore,
} from 'firebase/firestore'
import { BaseModel } from '../model/base.model'
import { provideTransient } from '../helper/provideSingleton'
import { PaginationDirectionEnum } from '../common/constants';

@provideTransient(RepositoryService)
export class RepositoryService {
	constructor() {}

	public async getPaginatedData<T extends BaseModel>(
		collection: Client,
		id: number,
		pageSize: number,
		constraints: QueryConstraint[],
		direction: PaginationDirectionEnum = PaginationDirectionEnum.Next,
	): Promise<{ rows: T[]; count: number }> {
		try {
			let q = null
			if(direction === PaginationDirectionEnum.Next) {
				q = query(collection, ...constraints, limit(pageSize), startAfter(id))
			}
			else if (direction === PaginationDirectionEnum.Previous) {
				q = query(collection, ...constraints, limit(pageSize), endBefore(id))
			}
			else {
				q = query(collection, ...constraints, limit(pageSize), endBefore(id))
			}
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
			console.error(error)
			return { rows: [], count: 0 } // Ensure correct structure here
		}
	}
}
