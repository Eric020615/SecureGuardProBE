import jwt from 'jsonwebtoken'
import { HttpStatusCode } from '../common/http-status-code'
import * as dotenv from 'dotenv'
import { provideSingleton } from '../helper/provideSingleton'
import { OperationError } from '../common/operation-error'

dotenv.config()

@provideSingleton(JwtConfig)
export class JwtConfig {
	private signature: string

	constructor() {
		this.signature = process.env.JWT_SIGNATURE || ''
	}

	public createToken = (AuthTokenPayloadDto: any, maxAge?: number) => {
		if (!this.signature) {
			throw new OperationError('SIGNATURE_NOT_FOUND', HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
		const options: jwt.SignOptions = maxAge ? { expiresIn: maxAge } : {};
		const jwtToken = jwt.sign(AuthTokenPayloadDto, this.signature, options);
		return jwtToken;
	}

	public decryptToken = <T>(token: string) => {
		if (!token) {
			throw new OperationError('TOKEN_NOT_PROVIDED', HttpStatusCode.FORBIDDEN)
		}
		if (!this.signature) {
			throw new OperationError('SIGNATURE_NOT_FOUND', HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
		let decodedData: T = {} as T
		jwt.verify(token, this.signature, (err: any, decoded: any) => {
			decodedData = decoded as T
			if (err) {
				throw new OperationError(err, HttpStatusCode.FORBIDDEN)
			}
		})
		return decodedData
	}
}
