import { RoleEnum } from '../common/role'

export interface AuthTokenPayloadDto {
	userGUID: string
	role: RoleEnum
}

export interface LoginDto {
	email: string
	password: string
}

export interface RegisterUserDto {
	email: string
	password: string
	confirmPassword: string
}

// export type UserCreationParams = Pick<LoginDto, "email" | "password">;