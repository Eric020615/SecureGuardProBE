import { Request } from 'express'
import { decryptToken } from '../config/jwt'
import { AuthTokenPayloadDto, SubUserAuthTokenPayloadDto } from '../dtos/auth.dto'
import { AuthService } from '../services/auth.service'
import { RoleEnum } from '../common/role'
import { iocContainer } from '../ioc'
import { OperationError } from '../common/operation-error'
import { HttpStatusCode } from '../common/http-status-code'

export interface ISecurityMiddlewareRequest extends Request {
	userGuid: string
	role: RoleEnum
	subUserEmail: string
	parentUserGuid: string
}

export const checkUserPermission = (token: string, scopes?: string[]) => {
	const userData = decryptToken<AuthTokenPayloadDto>(token)
	if (!userData) {
		throw new OperationError('INVALID_OR_MISSING_TOKEN_DATA', HttpStatusCode.FORBIDDEN)
	}
	if (!scopes) {
		throw new OperationError('JWT_SCOPE_EMPTY', HttpStatusCode.FORBIDDEN)
	}
	if (!scopes.includes(userData.role)) {
		throw new OperationError('ROLE_PERMISSION_INVALID', HttpStatusCode.FORBIDDEN)
	}
	return userData
}

export const expressAuthentication = async (
	request: ISecurityMiddlewareRequest,
	securityName: string,
	scopes?: string[],
	response?: any,
): Promise<any> => {
	let authService: AuthService = iocContainer.get(AuthService)
	const token = request.body.token || request.query.token || request.headers['authorization']
	try {
		if (securityName === 'jwt') {
			const userData = checkUserPermission(token, scopes)
			await authService.checkUserStatus(userData.userGUID)
			request.userGuid = userData.userGUID
			request.role = userData.role
			return Promise.resolve({})
		}
		if (securityName === 'newUser') {
			const userData = checkUserPermission(token, scopes)
			request.userGuid = userData.userGUID
			request.role = userData.role
			return Promise.resolve({})
		}
		if (securityName === 'subUserAuth') {
			const subUserData = decryptToken<SubUserAuthTokenPayloadDto>(token)
			await authService.checkUserStatus(subUserData.parentUserGuid)
			request.subUserEmail = subUserData.subUserEmail
			request.parentUserGuid = subUserData.parentUserGuid
			return Promise.resolve({})
		}
	} catch (error: any) {
		return response.status(402).json({
			message: error.message,
			status: 402,
			data: null,
		})
	}
}
