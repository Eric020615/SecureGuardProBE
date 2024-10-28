import { OperationError } from '../common/operation-error'
import { HttpStatusCode } from '../common/http-status-code'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { NotificationRepository } from '../repositories/notification.repository'
import { NotificationManager } from '../config/notification'
import { Notification } from '../models/notification.model'
import { DocumentStatus } from '../common/constants'
import { getCurrentTimestamp } from '../helper/time'

@provideSingleton(NotificationService)
export class NotificationService {
	constructor(
		@inject(NotificationRepository) private notificationRepository: NotificationRepository,
		@inject(NotificationManager) private notificationManager: NotificationManager,
	) {}

	createNotificationTokenService = async (token: string, userGuid: string) => {
		try {
			await this.notificationRepository.createNotificationTokenRepository(token, userGuid)
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	getNotificationTokenByUserGuidService = async (userGuid: string) => {
		try {
			const tokens = await this.notificationRepository.getNotificationTokenByUserGuidRepository(
				userGuid,
			)
			return tokens
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	sendNotificationByTokenService = async (
		token: string,
		title: string,
		body: string,
		data: Record<string, any>,
	) => {
		try {
			const [success, response] = await this.notificationManager.pushNotification({
				to: token,
				title: title,
				body: body,
				data: data,
				sound: 'default',
				priority: 'normal',
				channelId: 'default',
			})
			if (!success) {
				throw new OperationError(response, HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			return response
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	createNotificationService = async (
		title: string,
		body: string,
		data: Record<string, any>,
		userGuid: string,
	) => {
		try {
			await this.notificationRepository.createNotificationRepository(
				new Notification(
					0,
					userGuid,
					title,
					body,
					data,
					false,
					DocumentStatus.Active,
					userGuid,
					userGuid,
					getCurrentTimestamp(),
					getCurrentTimestamp(),
				),
			)
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}
}
