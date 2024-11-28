import { inject } from 'inversify'
import { HttpStatusCode } from '../common/http-status-code'
import { OperationError } from '../common/operation-error'
import { listUrl, MegeyeManager } from '../config/megeye'
import { CreatePersonDto, EditPersonDto } from '../dtos/megeye.dto'
import { provideSingleton } from '../helper/provideSingleton'

@provideSingleton(MegeyeService)
export class MegeyeService {
	constructor(
		@inject(MegeyeManager)
		private megeyeManager: MegeyeManager,
	) {}

	public async createPerson(createPersonDto: CreatePersonDto) {
		try {
			const [success, response] = await this.megeyeManager.MegeyeGlobalHandler({
				path: listUrl.personnelManagement.create.path,
				type: listUrl.personnelManagement.create.type,
				data: createPersonDto,
			})
			if (!success) {
				throw new OperationError('Failed to create user face auth', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			return response
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	public async editPerson(editPersonDto: EditPersonDto, userGuid: string) {
		try {
			const [success, response] = await this.megeyeManager.MegeyeGlobalHandler({
				path: listUrl.personnelManagement.edit.path.replace('{id}', userGuid),
				type: listUrl.personnelManagement.edit.type,
				data: editPersonDto,
			})
			if (!success) {
				throw new OperationError('Failed to edit user face auth', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			return response
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	public async queryPersonDetailsById(personId: string) {
		try {
			const [success, response] = await this.megeyeManager.MegeyeGlobalHandler({
				path: listUrl.personnelManagement.queryPersonDetailsById.path.replace('{id}', personId),
				type: listUrl.personnelManagement.queryPersonDetailsById.type,
			})
			if (!success) {
				return null
			}
			return response
		} catch (error: any) {
			return null
		}
	}
}
