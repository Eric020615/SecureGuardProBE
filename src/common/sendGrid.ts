// src/common/emailTemplates.ts

// Enum for SendGrid Template IDs
export enum SendGridTemplateIds {
	SubUserRegistration = 'd-765bf808211f4887aace92ee08cb979c',
	PasswordReset = 'd-abcdef1234567890abcdef1234567890',
	BookingConfirmation = 'd-fedcba0987654321fedcba0987654321',
}

// Interfaces for dynamic template data

// Registration email data structure
export interface SubUserRegistrationTemplateData {
	inviterName: string
	registrationUrl: string
}

// Password reset email data structure
export interface PasswordResetTemplateData {
	firstName: string
	resetPasswordUrl: string
}

// Booking confirmation email data structure
export interface BookingConfirmationTemplateData {
	firstName: string
	facilityName: string
	startDate: string
	endDate: string
}
