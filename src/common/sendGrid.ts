// src/common/emailTemplates.ts

// Enum for SendGrid Template IDs
export enum SendGridTemplateIds {
	SubUserRegistration = 'd-765bf808211f4887aace92ee08cb979c',
	PasswordReset = 'd-0857cc1e3b2542ae980ba569f216ffc2',
}

// Registration email data structure
export interface SubUserRegistrationTemplateData {
	inviterName: string
	registrationUrl: string
}

// Password reset email data structure
export interface PasswordResetTemplateData {
	resetPasswordUrl: string
}
