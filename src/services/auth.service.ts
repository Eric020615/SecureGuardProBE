import { signInWithEmailAndPassword } from "firebase/auth";
import { JwtPayloadDto, LoginDto } from "../dtos/auth.dto";
import firebase from "../config/firebase";
import { createToken } from "../config/jwt";
import { OperationError } from "../common/operation-error";
import { HttpStatusCode } from "../common/http-status-code";

const auth = firebase.FIREBASE_AUTH

export const loginService = async (loginDto: LoginDto) => {
    try {
        const response = await signInWithEmailAndPassword(auth, loginDto.email, loginDto.password);
        const token = createToken({
            userGUID: response.user.uid,
            role: "admin"
        } as JwtPayloadDto)
        return token
    }
    catch(error: any){
        throw new OperationError(
            error,
            HttpStatusCode.INTERNAL_SERVER_ERROR
        )
    }
}