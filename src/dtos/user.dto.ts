import { RoleEnum } from "../common/role";
import { GeneralFileDto } from "./index.dto";

export interface CreateUserDto {
    firstName: string;
    lastName: string;
    userName: string;
    contactNumber: string;
    gender: string;
    dateOfBirth: string;
}

export interface GetUserDto {
    userId: string;
    firstName: string;
    lastName: string;
    userName: string;
    contactNumber: string;
    gender: string;
    role: RoleEnum;
    dateOfBirth: string;
    createdBy: string;
    createdDateTime: string;
    updatedBy: string;
    updatedDateTime: string;
}

export interface CreateResidentDto extends CreateUserDto {
    unitNumber: string;
    floorNumber: string;
    supportedFiles: GeneralFileDto[]
}

export interface GetUserDetailsByIdDto {
    userId: string;
    firstName: string;
    lastName: string;
    userName: string;
    contactNumber: string;
    gender: string;
    role: RoleEnum;
    roleInformation?: ResidentInformationDto;
    dateOfBirth: string;
    createdBy: string;
    createdDateTime: string;
    updatedBy: string;
    updatedDateTime: string;
}

export interface ResidentInformationDto {
    floorNumber: string
	unitNumber: string
	supportedFiles: string[]
}