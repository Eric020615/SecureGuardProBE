import { OperationError } from '../common/operation-error'
import { HttpStatusCode } from '../common/http-status-code'
import {
	convertDateStringToTimestamp,
	convertTimestampToUserTimezone,
	getCurrentTimestamp,
} from '../helper/time'
import { provideSingleton } from '../helper/provideSingleton'
import { inject } from 'inversify'
import { DocumentStatus, PaginationDirection } from '../common/constants'
import { NotificationRepository } from '../repositories/notification.repository'

@provideSingleton(NotificationService)
export class NotificationService {
	constructor(
		@inject(NotificationRepository) private notificationRepository: NotificationRepository,
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
			const tokens = await this.notificationRepository.getNotificationTokenByUserGuidRepository(userGuid)
            return tokens
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}
}
