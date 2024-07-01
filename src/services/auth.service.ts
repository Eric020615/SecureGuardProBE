import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { JwtPayloadDto, LoginDto, RegisterUserDto } from "../dtos/auth.dto";
import firebase from "../config/firebase";
import { createToken } from "../config/jwt";
import { OperationError } from "../common/operation-error";
import { HttpStatusCode } from "../common/http-status-code";
import { FirebaseError } from "firebase/app";
import { convertFirebaseAuthEnumMessage } from "../common/firebase-error-code";

const auth = firebase.FIREBASE_AUTH

export const registerService = async (registerUserDto: RegisterUserDto) => {
    try {
        if(registerUserDto.confirmPassword 
            !== registerUserDto.password){
            throw new OperationError(
                "Confirm Password and Password not Match",
                HttpStatusCode.INTERNAL_SERVER_ERROR
            )
        }
        await createUserWithEmailAndPassword(auth, registerUserDto.email, registerUserDto.password);
    } catch (error: any) {
        if(error instanceof (FirebaseError)){
            throw new OperationError(
                convertFirebaseAuthEnumMessage(error.code),
                HttpStatusCode.INTERNAL_SERVER_ERROR
            )
        }
        throw new OperationError(
            error,
            HttpStatusCode.INTERNAL_SERVER_ERROR
        )
    }
}

export const loginService = async (loginDto: LoginDto) => {
    try {
        const response = await signInWithEmailAndPassword(auth, loginDto.email, loginDto.password);
        const token = createToken({
            userGUID: response.user.uid,
            role: "resident"
        } as JwtPayloadDto)
        return token
    }
    catch(error: any){
        if(error instanceof (FirebaseError)){
            throw new OperationError(
                convertFirebaseAuthEnumMessage(error.code),
                HttpStatusCode.INTERNAL_SERVER_ERROR
            )
        }
        throw new OperationError(
            "Account Login Failed",
            HttpStatusCode.INTERNAL_SERVER_ERROR
        )
    }
}