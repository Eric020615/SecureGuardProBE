import { DocumentStatusEnum, GenderEnum, RoleEnum } from '../common/constants'
import { GeneralFileDto, GeneralFileResponseDto } from './index.dto'

export interface CreateUserDto {
	firstName: string
	lastName: string
	userName: string
	contactNumber: string
	gender: keyof typeof GenderEnum
	dateOfBirth: string
}

export interface GetUserDto {
	userId: number
	userGuid: string
	firstName: string
	lastName: string
	userName: string
	contactNumber: string
	gender: keyof typeof GenderEnum
	role: keyof typeof RoleEnum
	dateOfBirth: string
	createdBy: string
	createdDateTime: string
	updatedBy: string
	updatedDateTime: string
}

export interface GetUserByAdminDto {
	userId: number
	userGuid: string
	firstName: string
	lastName: string
	userName: string
	contactNumber: string
	gender: keyof typeof GenderEnum
	role: keyof typeof RoleEnum
	userStatus: string
	status: keyof typeof DocumentStatusEnum
}

export interface CreateSubUserDto extends CreateUserDto {
	parentUserGuid: string
	subUserRequestGuid: string
}

export interface CreateResidentDto extends CreateUserDto {
	unit: string
	floor: string
	supportedDocuments: GeneralFileDto[]
}

export interface CreateStaffDto extends CreateUserDto {
	staffId: string
	supportedDocuments: GeneralFileDto[]
}

export interface GetUserDetailsByIdDto {
	userId: number
	userGuid: string
	firstName: string
	lastName: string
	userName: string
	email: string
	contactNumber: string
	gender: keyof typeof GenderEnum
	role: keyof typeof RoleEnum
	roleInformation?: ResidentInformationDto | StaffInformationDto
	dateOfBirth: string
	isActive?: boolean
	badgeNumber: string
	supportedDocuments: GeneralFileResponseDto[]
	status: keyof typeof DocumentStatusEnum
	createdBy: string
	createdDateTime: string
	updatedBy: string
	updatedDateTime: string
}

export interface ResidentInformationDto {
	floor: string
	unit: string
}

export interface StaffInformationDto {
	staffId: string
}

export interface EditUserDetailsByIdDto {
	firstName: string
	lastName: string
	userName: string
	email: string
	contactNumber: string
	gender: keyof typeof GenderEnum
	dateOfBirth: string
}

export interface CreateSubUserRequestDto {
	email: string
}

export interface DeleteSubUserByIdDto {
	subUserGuid: string
}

export interface GetSubUserByResidentDto {
	userId: number
	userGuid: string
	firstName: string
	lastName: string
	userName: string
	contactNumber: string
	gender: keyof typeof GenderEnum
	dateOfBirth: string
	status: keyof typeof DocumentStatusEnum
}
