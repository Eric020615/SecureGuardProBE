import { HttpStatusCode } from '../common/http-status-code'
import { OperationError } from '../common/operation-error'
import { listUrl, MegeyeManager } from '../config/megeye'
import { CreatePersonDto } from '../dtos/megeye.dto'
import { provideSingleton } from '../helper/provideSingleton'

@provideSingleton(MegeyeService)
export class MegeyeService {
	private megeyeManager: MegeyeManager

	constructor() {
		this.megeyeManager = new MegeyeManager()
	}

	public async createPerson(createPersonDto: CreatePersonDto) {
		try {
			await this.megeyeManager.requestNewCookie()
			const [success, response] = await this.megeyeManager.MegeyeGlobalHandler({
				path: listUrl.personnelManagement.create.path,
				type: listUrl.personnelManagement.create.type,
				data: createPersonDto,
			})
			if (!success) {
				throw new OperationError(
					'Failed to create user face auth',
					HttpStatusCode.INTERNAL_SERVER_ERROR,
				)
			}
			return response
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	public async queryPersonnel() {
		try {
			await this.megeyeManager.requestNewCookie()
			const [success, response] = await this.megeyeManager.MegeyeGlobalHandler({
				path: listUrl.personnelManagement.query.path,
				type: listUrl.personnelManagement.query.type,
				data: {
					limit: 10,
					offset: 0,
					sort: 'asc',
				},
			})
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}
}
