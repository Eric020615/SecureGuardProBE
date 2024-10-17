import sgMail from '@sendgrid/mail'
import * as dotenv from 'dotenv'
import { provideSingleton } from '../helper/provideSingleton'

interface EmailOptions {
	to: string
	subject: string
	text?: string
	html?: string
}

dotenv.config()

@provideSingleton(EmailService)
export class EmailService {
	constructor() {
		// Set the SendGrid API key
		sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)
	}

	/**
	 * Send a generic email with dynamic content
	 * @param {EmailOptions} emailOptions - Object containing recipient, subject, and email content
	 * @returns Promise<any>
	 */
	public async sendEmail(
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
			const response = await sgMail.send(msg)
			// console.log('Email sent: ' + response[0].statusCode)
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

	// /**
	//  * Send a registration email with a dynamic URL
	//  * @param {string} to - Recipient's email address
	//  * @param {string} registrationUrl - URL for the registration link
	//  * @returns Promise<any>
	//  */
	// public async sendRegistrationEmail(to: string, registrationUrl: string): Promise<any> {
	// 	const subject = 'Complete Your Registration'
	// 	const text = `Click the following link to complete your registration: ${registrationUrl}`
	// 	const html = `
	// 		<p>Thank you for registering!</p>
	// 		<p>Please click the link below to complete your registration:</p>
	// 		<a href="${registrationUrl}">Complete Registration</a>
	// 	`

	// 	return this.sendEmail({ to, subject, text, html })
	// }

	// /**
	//  * Send a custom email with dynamic content
	//  * @param {string} to - Recipient's email address
	//  * @param {string} subject - Email subject
	//  * @param {string} content - Email content (HTML or plain text)
	//  * @param {boolean} isHtml - Whether the content is HTML (default is true)
	//  * @returns Promise<any>
	//  */
	// public async sendCustomEmail(
	// 	to: string,
	// 	subject: string,
	// 	content: string,
	// 	isHtml: boolean = true,
	// ): Promise<any> {
	// 	const options: EmailOptions = {
	// 		to,
	// 		subject,
	// 		text: isHtml ? undefined : content, // Plain text content if not HTML
	// 		html: isHtml ? content : undefined, // HTML content if isHtml is true
	// 	}

	// 	return this.sendEmail(options)
	// }
}
