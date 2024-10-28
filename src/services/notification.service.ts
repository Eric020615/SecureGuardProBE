import { OperationError } from '../common/operation-error'
import { HttpStatusCode } from '../common/http-status-code'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { NotificationRepository } from '../repositories/notification.repository'
import { NotificationManager } from '../config/notification'
import { Notification } from '../models/notification.model'
import { DocumentStatus } from '../common/constants'
import { convertTimestampToUserTimezone, getCurrentTimestamp } from '../helper/time'
import { GetNotificationDto } from '../dtos/notification.dto'

@provideSingleton(NotificationService)
export class NotificationService {
	constructor(
		@inject(NotificationRepository) private notificationRepository: NotificationRepository,
		@inject(NotificationManager) private notificationManager: NotificationManager,
	) {}

	handleNotificationService = async (
		title: string,
		body: string,
		data: Record<string, any>,
		userGuid: string,
		shouldPersist: boolean,
	) => {
		try {
			const notificationToken = await this.getNotificationTokenByUserGuidService(userGuid)
			if (notificationToken) {
				await this.sendNotificationByTokenService(notificationToken, title, body, data)
			}
			if (shouldPersist) {
				await this.createNotificationService(title, body, data, userGuid)
			}
		} catch (error) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	createNotificationTokenService = async (token: string, userGuid: string) => {
		try {
			await this.notificationRepository.createNotificationTokenRepository(token, userGuid)
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	getNotificationTokenByUserGuidService = async (userGuid: string) => {
		try {
			const data = await this.notificationRepository.getNotificationTokenByUserGuidRepository(userGuid)
			return data.tokens
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	sendNotificationByTokenService = async (
		token: string | string[],
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

	createNotificationService = async (title: string, body: string, data: Record<string, any>, userGuid: string) => {
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

	getNotificationService = async (id: number, limit: number, userGuid: string) => {
		try {
			let { rows, count } = await this.notificationRepository.getNotificationRepository(id, limit, userGuid)
			let data: GetNotificationDto[] = []
			data = rows
				? rows.map((notification) => {
						return {
							notificationId: notification.id,
							notificationGuid: notification.guid,
							userGuid: notification.userGuid,
							title: notification.title,
							body: notification.body,
							data: notification.data,
							isRead: notification.isRead,
							createdBy: notification.createdBy,
							createdDateTime: convertTimestampToUserTimezone(notification.createdDateTime),
							updatedBy: notification.updatedBy,
							updatedDateTime: convertTimestampToUserTimezone(notification.updatedDateTime),
						} as GetNotificationDto
				  })
				: []
			return { data, count }
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}
}
