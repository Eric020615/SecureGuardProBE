export interface ExpoNotificationRequest {
	to: string | string[] // Expo push token of the recipient, e.g., "ExponentPushToken[xxxxxxxxxxxxxx]"
	title?: string // Title of the notification
	body?: string // Message body of the notification
	data?: Record<string, any> // Additional data to send along with the notification
	sound?: 'default' | null // Notification sound, "default" plays the standard notification sound
	priority?: 'default' | 'normal' | 'high' // Priority of the notification
	channelId?: string // Channel ID for Android notifications (useful for grouped notifications)
}

export interface ExpoNotificationResponse {
	data: {
		id: string // Unique identifier for the notification
		status: 'ok' | 'error' // Status of the request
		message?: string // Error message, if any
		details?: {
			error?: string // Details on the error if the status is "error"
		}
	}
}

export interface GetNotificationDto {
	notificationId: number
	notificationGuid: string
	userGuid: string
	title: string
	body: string
	data: any
	isRead: boolean
	createdBy: string
	createdDateTime: string
	updatedBy: string
	updatedDateTime: string
}
