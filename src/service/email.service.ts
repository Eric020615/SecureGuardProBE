import sgMail from '@sendgrid/mail'
import * as dotenv from 'dotenv'
import { provideSingleton } from '../helper/provideSingleton'

dotenv.config()

@provideSingleton(EmailService)
export class EmailService {
	constructor() {
		// Set the SendGrid API key
		sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)
	}

	public async sendEmailService(
		to: string,
		templateId: string,
		dynamicTemplateData: any,
	): Promise<[boolean, any]> {
		const msg = {
			to, // Recipient's email address
			from: process.env.SENDGRID_SENDER as string, // Sender address
			templateId,
			dynamicTemplateData,
		}

		try {
			await sgMail.send(msg)
			return [ true, 'Email sent successfully' ]
		} catch (error: any) {
			if (error.response) {
				console.error('Response Body:', JSON.stringify(error.response.body, null, 2))
			} else {
				console.error('Unexpected Error:', error)
			}
			return [ false, 'Failed to send email' ]
		}
	}
}
