import { GenderEnum, RoleEnum } from '../common/role'
import { GeneralFileDto, GeneralFileResponseDto } from './index.dto'

export interface CreateUserDto {
	firstName: string
	lastName: string
	userName: string
	contactNumber: string
	gender: GenderEnum
	dateOfBirth: string
}

export interface GetUserDto {
	userId: number
	userGuid: string
	firstName: string
	lastName: string
	userName: string
	contactNumber: string
	gender: string
	role: RoleEnum
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
    gender: GenderEnum
    role: RoleEnum
    userStatus: string
	status: string
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
	gender: string
	role: RoleEnum
	roleInformation?: ResidentInformationDto | SystemInformationDto
	dateOfBirth: string
	isActive?: boolean
	status: string
	createdBy: string
	createdDateTime: string
	updatedBy: string
	updatedDateTime: string
}

export interface ResidentInformationDto {
	floor: string
	unit: string
	supportedDocuments: GeneralFileResponseDto[]
}

export interface SystemInformationDto {
	staffId: string
	supportedDocuments: GeneralFileResponseDto[]
}

export interface EditUserDetailsByIdDto {
	firstName: string
	lastName: string
	userName: string
	email: string
	contactNumber: string
	gender: string
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
	gender: string
	dateOfBirth: string
	status: boolean
}