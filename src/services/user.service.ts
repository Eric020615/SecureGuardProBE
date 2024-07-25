import { OperationError } from "../common/operation-error";
import { HttpStatusCode } from "../common/http-status-code";
import { FirebaseError } from "firebase/app";
import { convertFirebaseAuthEnumMessage } from "../common/firebase-error-code";
import { CreateResidentDto } from "../dtos/user.dto";
import { Resident, User, UserRole } from "../models/user.model";
import { createResidentRepository } from "../repositories/user.repository";
import { convertDateStringToTimestamp, getNowTimestamp } from "../helper/time";
import firebaseAdmin from "../config/firebaseAdmin";
import { uploadFile } from "../helper/file";

const authAdmin = firebaseAdmin.FIREBASE_ADMIN_AUTH

export const createUserService = async (
  createUserDto: CreateResidentDto,
  userId: string,
  role: UserRole
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
