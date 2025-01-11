import { IPaginatedResponse, IResponse } from '../dto/index.dto'
import { NotificationService } from '../service/notification.service'
import { Controller, OperationId, Get, Response, Route, SuccessResponse, Tags, Security, Request, Query } from 'tsoa'
import { HttpStatusCode } from '../common/http-status-code'
import { ISecurityMiddlewareRequest } from '../middleware/security.middleware'
import { OperationError } from '../common/operation-error'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { GetNotificationDto } from '../dto/notification.dto'

@Route('notifications')
@provideSingleton(NotificationController)
export class NotificationController extends Controller {
	constructor(@inject(NotificationService) private notificationService: NotificationService) {
		super()
	}

	@Tags('Notification')
	@OperationId('getNotification')
	@Response<IResponse<GetNotificationDto[]>>(HttpStatusCode.BAD_REQUEST, 'Bad Request')
	@SuccessResponse(HttpStatusCode.OK, 'OK')
	@Get('/')
	@Security('jwt', ['RES', 'SUB', 'STF'])
	public async getNotification(
		@Request() request: ISecurityMiddlewareRequest,
		@Query() id: number,
		@Query() limit: number,
	): Promise<IPaginatedResponse<GetNotificationDto>> {
		try {
			if (!request.userGuid) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			let { data, count } = await this.notificationService.getNotificationService(id, limit, request.userGuid)
			const response = {
				message: 'Notifications retrieved successfully',
				status: '200',
				data: {
					list: data,
					count: count,
				},
			}
			return response
		} catch (err) {
			this.setStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
			const response = {
				message: 'Notifications retrieved successfully',
				status: '200',
				data: {
					list: null,
					count: 0,
				},
			}
			return response
		}
	}
}
