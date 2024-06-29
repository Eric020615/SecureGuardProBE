import * as dotenv from 'dotenv';
import jwt, { JwtPayload } from "jsonwebtoken"
import { OperationError } from '../common/operation-error';
import { HttpStatusCode } from '../common/http-status-code';
import { JwtPayloadDto } from '../dtos/auth.dto';

dotenv.config();

const maxAge = 3 * 24 * 60 * 60;
const signature = process.env.JWT_SIGNATURE
export const createToken = (jwtPayloadDto: JwtPayloadDto) => {
    if(!signature){
        throw new OperationError(
            "SIGNATURE_NOT_FOUND",
            HttpStatusCode.INTERNAL_SERVER_ERROR
        )
    }
    const jwtToken = jwt.sign(
        jwtPayloadDto, 
        signature, 
        {
            expiresIn: maxAge
        }
    )
    return jwtToken;
}

export const verifyToken = (token: string, scopes?: string[]) => {
    if (!token) {
        throw new OperationError(
            "TOKEN_NOT_PROVIDED",
            HttpStatusCode.FORBIDDEN
        )
    }
    if(!signature){
        throw new OperationError(
            "SIGNATURE_NOT_FOUND",
            HttpStatusCode.INTERNAL_SERVER_ERROR
        )
    }
    let decoded : JwtPayloadDto = {} as JwtPayloadDto;
    jwt.verify(token, signature, (err: any, decoded: any) => {
        console.log(decoded)
        if (err) {
            throw new OperationError(
                err,
                HttpStatusCode.FORBIDDEN
            )
        } else {
          // Check if JWT contains all required scopes
          if(!scopes){
            throw new OperationError(
                "JWT_SCOPE_EMPTY",
                HttpStatusCode.FORBIDDEN
            )
          }
          else{
            if(!scopes.includes(decoded.role)){
                throw new OperationError(
                    "ROLE_PERMISSION_INVALID",
                    HttpStatusCode.FORBIDDEN
                )
            }
          }
          decoded = decoded; 
        }
    });
    return decoded;
}
