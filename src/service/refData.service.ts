import { OperationError } from '../common/operation-error'
import { HttpStatusCode } from '../common/http-status-code'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { RefDataRepository } from '../repository/refData.repository'
import { GetPropertyListDto } from '../dto/refData.dto'

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
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	getUserGuidByPropertyService = async (floor: string, unit: string) => {
		try {
			let userGuid = await this.refDataRepository.getUserGuidByPropertyRepository(floor, unit)
			return userGuid
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}
}
