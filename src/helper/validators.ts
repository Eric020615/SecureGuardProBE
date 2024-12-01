import validator, { MobilePhoneLocale } from 'validator'

// Validate email format
export const validateEmail = (email: string): boolean => {
	if (!email) return false
	return validator.isEmail(email)
}

// Validate password complexity
export const validatePassword = (
	password: string,
	options: {
		minLength?: number
		minUppercase?: number
		minLowercase?: number
		minNumbers?: number
		minSymbols?: number
	} = {
		minLength: 8,
		minUppercase: 1,
		minLowercase: 1,
		minNumbers: 1,
		minSymbols: 1,
	},
): boolean => {
	if (!password) return false

	const { minLength = 8, minUppercase = 1, minLowercase = 1, minNumbers = 1, minSymbols = 1 } = options

	const lengthValid = password.length >= minLength
	const uppercaseValid = (password.match(/[A-Z]/g) || []).length >= minUppercase
	const lowercaseValid = (password.match(/[a-z]/g) || []).length >= minLowercase
	const numberValid = (password.match(/\d/g) || []).length >= minNumbers
	const symbolValid = (password.match(/[@$!%*?&]/g) || []).length >= minSymbols

	return lengthValid && uppercaseValid && lowercaseValid && numberValid && symbolValid
}

// Validate URL
export const validateURL = (url: string): boolean => {
	if (!url) return false
	return validator.isURL(url)
}

// Validate if the input is a number
export const isNumber = (input: string): boolean => {
	return validator.isNumeric(input)
}

// Validate if the input is an integer
export const isInteger = (input: string): boolean => {
	return validator.isInt(input)
}

// Validate if the input is a boolean
export const isBoolean = (input: string): boolean => {
	return input === 'true' || input === 'false'
}

// Validate phone number format
export const validatePhoneNumber = (
	phone: string,
	region: MobilePhoneLocale | MobilePhoneLocale[] = 'ms-MY',
): boolean => {
	if (!phone) return false
	return validator.isMobilePhone(phone, region)
}

// Validate if a string is empty or contains only whitespace
export const isEmptyOrWhitespace = (input: string): boolean => {
	return !input || input.trim() === ''
}

// Validate minimum and maximum length of a string
export const validateStringLength = (input: string, minLength: number, maxLength: number): boolean => {
	if (!input) return false
	const length = input.length
	return length >= minLength && length <= maxLength
}

// Validate if the input matches a specific regex pattern
export const validateRegex = (input: string, pattern: RegExp): boolean => {
	if (!input || !pattern) return false
	return pattern.test(input)
}
