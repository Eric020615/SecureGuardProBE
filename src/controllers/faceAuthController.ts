import { IResponse } from '../dtos/index.dto'
import {
	Body,
	Controller,
	OperationId,
	Post,
	Response,
	Route,
	SuccessResponse,
	Tags,
	Security,
	Request,
	Put,
} from 'tsoa'
import { HttpStatusCode } from '../common/http-status-code'
import { MegeyeService } from '../services/megeye.service'
import { ISecurityMiddlewareRequest } from '../middleware/security.middleware'
import { OperationError } from '../common/operation-error'
import { RoleEnum } from '../common/role'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { UserService } from '../services/user.service'
import { FaceAuthService } from '../services/faceAuth.service'
import { MicroEngineService } from '../services/microEngineService'
import { CreateUpdateFaceAuthDto } from '../dtos/faceAuth.dto'

@Route('face-auth')
@provideSingleton(FaceAuthController)
export class FaceAuthController extends Controller {
	constructor(
		@inject(UserService) private userService: UserService,
		@inject(MegeyeService) private megeyeService: MegeyeService,
		@inject(MicroEngineService) private microEngineService: MicroEngineService,
		@inject(FaceAuthService) private faceAuthService: FaceAuthService,
	) {
		super()
	}

	@Tags('FaceAuth')
	@OperationId('createFaceAuth')
	@Response<IResponse<any>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Post('/')
	@Security('jwt', ['SA', 'STF', 'RES', 'SUB'])
	public async createFaceAuth(
		@Body() createUpdateFaceAuthDto: CreateUpdateFaceAuthDto,
		@Request() request: ISecurityMiddlewareRequest,
	): Promise<IResponse<any>> {
		try {
			if (!request.userGuid || !request.role) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			this.faceAuthService.createUpdateFaceAuth(request.userGuid, request.role, createUpdateFaceAuthDto)
			const response = {
				message: 'Successfully upload user face auth',
				status: '200',
				data: null,
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: 'Failed to upload user face auth',
				status: '500',
				data: null,
			}
			return response
		}
	}
}
