import { RoleEnum } from '../common/role'

export interface AuthTokenPayloadDto {
	userGuid: string
	role: RoleEnum
}

export interface SubUserAuthTokenPayloadDto {
	subUserRequestGuid: string
    subUserEmail: string
    parentUserGuid: string
}

export interface VisitorPassTokenPayloadDto {
	visitorGuid: string
}

export interface LoginDto {
	email: string
	password: string
	notificationToken?: string
}

export interface RegisterUserDto {
	email: string
	password: string
	confirmPassword: string
}

export interface RequestResetPasswordDto {
	email: string
}

export interface ResetPasswordDto {
	currentPassword: string
	newPassword: string
}