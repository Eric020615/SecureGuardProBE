import * as dotenv from 'dotenv'
import axios, { AxiosError } from 'axios'
import { provideSingleton } from '../helper/provideSingleton'
import { ExpoNotificationRequest, ExpoNotificationResponse } from '../dto/notification.dto'

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
			const response = await axios.post(this.notificationConfig.notificationUrl, data, {
				headers: {
                    'Content-Type': 'application/json',
				},
			})
			return [true, response.data]
		} catch (error: any) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data)
            }
			return [false, error]
		}
	}
}
