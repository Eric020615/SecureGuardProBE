import { OperationError } from '../common/operation-error'
import { HttpStatusCode } from '../common/http-status-code'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { RefDataRepository } from '../repositories/refData.repository'
import { GetPropertyListDto } from '../dtos/refData.dto'

@provideSingleton(RefDataService)
export class RefDataService {
	constructor(
		@inject(RefDataRepository)
		private refDataRepository: RefDataRepository,
	) {}

	getPropertyListService = async (checkOccupied: boolean) => {
		try {
			let propertyList = await this.refDataRepository.getPropertyListRepository(checkOccupied)
			let data: GetPropertyListDto[] = []
			data = propertyList
				? Object.entries(propertyList).map(([floorId, units]) => ({
						floorId,
						units: units,
				  }))
				: []
			return data
		} catch (error: any) {
            console.log(error)
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}
}
