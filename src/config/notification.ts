import * as dotenv from 'dotenv'
import axios from 'axios'
import { provideSingleton } from '../helper/provideSingleton'
import { ExpoNotificationRequest, ExpoNotificationResponse } from '../dtos/notification.dto'

dotenv.config()

@provideSingleton(NotificationManager)
export class NotificationManager {
	private notificationConfig = {
		notificationUrl: process.env.NOTIFICATION_URL || '',
	}

	constructor() {}

	// Handler function to perform requests
	public async pushNotification(data: ExpoNotificationRequest): Promise<[boolean, ExpoNotificationResponse]> {
		try {
			const response = await axios.post<ExpoNotificationResponse>(this.notificationConfig.notificationUrl, data, {
				headers: {
					'Content-Type': 'application/json',
				},
			})
			return [true, response.data]
		} catch (error: any) {
			return [false, error.response.data]
		}
	}
}
