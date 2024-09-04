import { OperationError } from "../common/operation-error";
import { HttpStatusCode } from "../common/http-status-code";
import { FirebaseError } from "firebase/app";
import { convertFirebaseAuthEnumMessage } from "../common/firebase-error-code";
import { CreateResidentDto, CreateSystemAdminDto, GetUserDetailsByIdDto, GetUserDto } from "../dtos/user.dto";
import { Resident, SystemAdmin, User } from "../models/user.model";
import { createResidentRepository, createSystemAdminRepository, GetResidentDetailsRepository, GetSystemAdminDetailsRepository, GetUserByIdRepository, GetUserListRepository, updateUserStatusByIdRepository } from "../repositories/user.repository";
import { convertDateStringToTimestamp, convertTimestampToUserTimezone, getNowTimestamp } from "../helper/time";
import firebaseAdmin from "../config/firebaseAdmin";
import { uploadFile } from "../helper/file";
import { RoleEnum } from "../common/role";
import { UserRecord } from "firebase-admin/auth";

const authAdmin = firebaseAdmin.FIREBASE_ADMIN_AUTH

export const createUserService = async (
  createUserDto: CreateResidentDto | CreateSystemAdminDto,
  userId: string,
  role: RoleEnum
) => {
  try {
    const fileUrl = await uploadFile(createUserDto.supportedFiles, userId);
    if(role === RoleEnum.RESIDENT && instanceOfCreateResidentDto(createUserDto)){
      await createResidentRepository(
        new User(
          createUserDto.firstName,
          createUserDto.lastName,
          createUserDto.contactNumber,
          createUserDto.gender,
          convertDateStringToTimestamp(createUserDto.dateOfBirth),
          role,
          userId,
          userId,
          getNowTimestamp(),
          getNowTimestamp()
        ),
        new Resident(
          createUserDto.floorNumber,
          createUserDto.unitNumber,
          userId,
          userId,
          getNowTimestamp(),
          getNowTimestamp(),
          fileUrl ? fileUrl : []
        ),
        userId
      );
    }
    else if(role === RoleEnum.SYSTEM_ADMIN && instanceOfCreateSystemAdminDto(createUserDto)){
      await createSystemAdminRepository(
        new User(
          createUserDto.firstName,
          createUserDto.lastName,
          createUserDto.contactNumber,
          createUserDto.gender,
          convertDateStringToTimestamp(createUserDto.dateOfBirth),
          role,
          userId,
          userId,
          getNowTimestamp(),
          getNowTimestamp()
        ),
        new SystemAdmin(
          createUserDto.staffId,
          userId,
          userId,
          getNowTimestamp(),
          getNowTimestamp(),
          fileUrl ? fileUrl : []
        ),
        userId
      );
    }
    await authAdmin.updateUser(userId, {displayName: createUserDto.userName})
  } catch (error: any) {
    if (error instanceof FirebaseError) {
      throw new OperationError(
        convertFirebaseAuthEnumMessage(error.code),
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
    throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
};

export const GetUserByIdService = async (
  userId: string
) => {
  try {
    const userInformation = await GetUserByIdRepository(userId);
    let data: GetUserDto = {} as GetUserDto;
    data = {
      userId: userInformation.id ? userInformation.id : "",
      userName: "",
      firstName: userInformation.firstName,
      lastName: userInformation.lastName,
      gender: userInformation.gender,
      role: userInformation.role,
      dateOfBirth: convertTimestampToUserTimezone(userInformation.dateOfBirth),
      contactNumber: userInformation.contactNumber,
      createdBy: userInformation.createdBy,
      createdDateTime: convertTimestampToUserTimezone(userInformation.createdDateTime),
      updatedBy: userInformation.updatedBy,
      updatedDateTime: convertTimestampToUserTimezone(userInformation.updatedDateTime)
    };
    return data;
  } catch (error: any) {
    throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
};

export const GetUserListService = async (isActive: boolean) => {
  try {
    const userResult = await authAdmin.listUsers()
    let userList : UserRecord[] = [];
    if(isActive){
      userList = userResult.users.filter((user) => 
        !user.disabled
      )
    }
    else{
      userList = userResult.users.filter((user) => 
        user.disabled
      )
    }
    const userInformationList = await GetUserListRepository(userList);
    let data: GetUserDto[] = [];
    data = userInformationList && userInformationList.length > 0
      ? userInformationList.map((userInformation) => {
          return {
              userId: userInformation.id ? userInformation.id : "",
              userName: "",
              firstName: userInformation.firstName,
              lastName: userInformation.lastName,
              gender: userInformation.gender,
              role: userInformation.role,
              dateOfBirth: convertTimestampToUserTimezone(userInformation.dateOfBirth),
              contactNumber: userInformation.contactNumber,
              createdBy: userInformation.createdBy,
              createdDateTime: convertTimestampToUserTimezone(userInformation.createdDateTime),
              updatedBy: userInformation.updatedBy,
              updatedDateTime: convertTimestampToUserTimezone(userInformation.updatedDateTime)
          } as GetUserDto;
        })
      : [];
    return data;
  } catch (error: any) {
    throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
}

export const GetUserDetailsByIdService = async (
  userId: string
) => {
  try {
    const userDetails = await GetUserByIdRepository(userId);
    let data: GetUserDetailsByIdDto = {} as GetUserDetailsByIdDto;
    const userRecord = await authAdmin.getUser(userId);
    data = {
      userId: userDetails.id ? userDetails.id : "",
      userName: userRecord.displayName ? userRecord.displayName : "",
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      email: userRecord.email ? userRecord.email : "",
      gender: userDetails.gender,
      role: userDetails.role,
      dateOfBirth: convertTimestampToUserTimezone(userDetails.dateOfBirth),
      isActive: !userRecord.disabled,
      contactNumber: userDetails.contactNumber,
      createdBy: userDetails.createdBy,
      createdDateTime: convertTimestampToUserTimezone(userDetails.createdDateTime),
      updatedBy: userDetails.updatedBy,
      updatedDateTime: convertTimestampToUserTimezone(userDetails.updatedDateTime)
    };
    if(userDetails.role === RoleEnum.RESIDENT){
      const residentDetails = await GetResidentDetailsRepository(userId);
      data.roleInformation = {
        floorNumber: residentDetails.floorNumber,
        unitNumber: residentDetails.unitNumber,
        supportedFiles: residentDetails.supportedDocumentUrl
      };
    }        
    if(data.role === RoleEnum.SYSTEM_ADMIN){
      const systemAdminDetails = await GetSystemAdminDetailsRepository(userId);
      data.roleInformation = {
        staffId: systemAdminDetails.staffId,
        supportedFiles: systemAdminDetails.supportedDocumentUrl
      };
    }
    return data;
  } catch (error: any) {
    throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
};

export const activateUserByIdService = async (
  userId: string,
  updatedBy: string
) => {
  try {
    const userRecord = await authAdmin.getUser(userId);
    if(!userRecord.disabled){
      throw new OperationError("User was activated before.", HttpStatusCode.INTERNAL_SERVER_ERROR);
    }
    await authAdmin.updateUser(userId, {disabled: false})
    await updateUserStatusByIdRepository(userId, {
      updatedBy: updatedBy,
      updatedDateTime: getNowTimestamp()
    } as User)
  } catch (error: any) {
    throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
};

export const deactivateUserByIdService = async (
  userId: string,
  updatedBy: string
) => {
  try {
    const userRecord = await authAdmin.getUser(userId);
    if(userRecord.disabled){
      throw new OperationError("User was deactivated before.", HttpStatusCode.INTERNAL_SERVER_ERROR);
    }
    await authAdmin.updateUser(userId, {disabled: true})
    await updateUserStatusByIdRepository(userId, {
      updatedBy: updatedBy,
      updatedDateTime: getNowTimestamp()
    } as User)
  } catch (error: any) {
    throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
};

const instanceOfCreateResidentDto = (object: any): object is CreateResidentDto => {
  return 'floor' && 'unitNumber' in object;
}

const instanceOfCreateSystemAdminDto = (object: any): object is CreateSystemAdminDto => {
  return 'staffId' in object;
}