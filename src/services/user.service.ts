import { OperationError } from "../common/operation-error";
import { HttpStatusCode } from "../common/http-status-code";
import { FirebaseError } from "firebase/app";
import { convertFirebaseAuthEnumMessage } from "../common/firebase-error-code";
import { CreateResidentDto, GetUserInformationDto } from "../dtos/user.dto";
import { Resident, User } from "../models/user.model";
import { createResidentRepository, getUserInformationRepository } from "../repositories/user.repository";
import { convertDateStringToTimestamp, convertTimestampToUserTimezone, getNowTimestamp } from "../helper/time";
import firebaseAdmin from "../config/firebaseAdmin";
import { uploadFile } from "../helper/file";
import { RoleEnum } from "../common/role";

const authAdmin = firebaseAdmin.FIREBASE_ADMIN_AUTH

export const createUserService = async (
  createUserDto: CreateResidentDto,
  userId: string,
  role: RoleEnum
) => {
  try {
    const FileURL = await uploadFile(createUserDto.supportedFiles, userId);
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
        getNowTimestamp(),
        getNowTimestamp(),
        FileURL ? FileURL : []
      ),
      userId
    );
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

export const getUserInformationService = async (
  userId: string
) => {
  try {
    const userInformation = await getUserInformationRepository(userId);
    let data: GetUserInformationDto = {} as GetUserInformationDto;
    data = {
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