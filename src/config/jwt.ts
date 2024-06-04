import * as bcrypt from "bcrypt"
import * as dotenv from 'dotenv';
import jwt, { JwtPayload } from "jsonwebtoken"

dotenv.config();

const maxAge = 3 * 24 * 60 * 60;
const signature = process.env.JWT_SIGNATURE
export const createToken = (userId: string) => {
    if(!signature){
        throw "Signature not found";
    }

    const jwtToken = jwt.sign({userId}, 
        signature, {
            expiresIn: maxAge
        })
    return jwtToken;
}

export const verifyToken = (token: string) => {
    if(!signature){
        throw "Signature not found";
    }

    const payload = jwt.verify(token, signature) as JwtPayload;
    return payload;
}
