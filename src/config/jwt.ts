import * as dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { OperationError } from '../common/operation-error'
import { HttpStatusCode } from '../common/http-status-code'

dotenv.config()

const signature = process.env.JWT_SIGNATURE
export const createToken = (AuthTokenPayloadDto: any, maxAge: number = 3 * 24 * 60 * 60) => {
	if (!signature) {
		throw new OperationError('SIGNATURE_NOT_FOUND', HttpStatusCode.INTERNAL_SERVER_ERROR)
	}
	const jwtToken = jwt.sign(AuthTokenPayloadDto, signature, {
		expiresIn: maxAge,
	})
	return jwtToken
}

export const decryptToken = <T>(token: string) => {
	if (!token) {
		throw new OperationError('TOKEN_NOT_PROVIDED', HttpStatusCode.FORBIDDEN)
	}
	if (!signature) {
		throw new OperationError('SIGNATURE_NOT_FOUND', HttpStatusCode.INTERNAL_SERVER_ERROR)
	}
	let decodedData: T = {} as T
	jwt.verify(token, signature, (err: any, decoded: any) => {
		decodedData = decoded as T
		if (err) {
			throw new OperationError(err, HttpStatusCode.FORBIDDEN)
		}
	})
	return decodedData
}

// export const verifyAuthToken = (token: string, scopes?: string[]) => {
// 	const decodedData = decryptToken<AuthTokenPayloadDto>(token)
// 	if (!decodedData) {
// 		throw new OperationError('TOKEN_NOT_PROVIDED', HttpStatusCode.FORBIDDEN)
// 	}
// 	if (!scopes) {
// 		throw new OperationError('JWT_SCOPE_EMPTY', HttpStatusCode.FORBIDDEN)
// 	}
// 	if (scopes.length === 0) {
// 		return decodedData
// 	}
// 	if (!scopes.includes(decodedData.role)) {
// 		throw new OperationError('ROLE_PERMISSION_INVALID', HttpStatusCode.FORBIDDEN)
// 	}
// 	return decodedData
// }
