import { inject } from 'inversify'
import { HttpStatusCode } from '../common/http-status-code'
import { OperationError } from '../common/operation-error'
import { listUrl, MegeyeManager } from '../config/megeye'
import { CreatePersonDto, EditPersonDto } from '../dto/megeye.dto'
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
				// Assuming response is an array of ErrorDetail objects
				if (Array.isArray(response) && response.length > 0) {
					const errorDetail = response[0]
					// Throw the error with the message from the response
					throw new OperationError(
						errorDetail.detail || 'Failed to create user face auth', // Use the error detail from the first object or fallback
						HttpStatusCode.INTERNAL_SERVER_ERROR,
					)
				} else {
					// Fallback if the response does not contain any errors
					throw new OperationError('Failed to create user face auth', HttpStatusCode.INTERNAL_SERVER_ERROR)
				}
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
				// Assuming response is an array of ErrorDetail objects
				if (Array.isArray(response.errors) && response.errors.length > 0) {
					const errorDetail = response.errors[0]
					// Throw the error with the message from the response
					throw new OperationError(
						errorDetail.detail || 'Failed to create user face auth', // Use the error detail from the first object or fallback
						HttpStatusCode.INTERNAL_SERVER_ERROR,
					)
				} else {
					// Fallback if the response does not contain any errors
					throw new OperationError('Failed to edit user face auth', HttpStatusCode.INTERNAL_SERVER_ERROR)
				}
			}
			return response
		} catch (error: any) {
			throw new OperationError(error.message, HttpStatusCode.INTERNAL_SERVER_ERROR)
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
