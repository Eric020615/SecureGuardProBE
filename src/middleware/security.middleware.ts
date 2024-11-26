import { Request } from 'express'
import { AuthTokenPayloadDto, SubUserAuthTokenPayloadDto, VisitorPassTokenPayloadDto } from '../dtos/auth.dto'
import { AuthService } from '../services/auth.service'
import { RoleEnum } from '../common/role'
import { iocContainer } from '../ioc'
import { OperationError } from '../common/operation-error'
import { HttpStatusCode } from '../common/http-status-code'
import { JwtConfig } from '../config/jwtConfig'

export interface ISecurityMiddlewareRequest extends Request {
	userGuid: string
	role: RoleEnum
	subUserEmail: string
	parentUserGuid: string
	subUserRequestGuid: string
	visitorGuid: string
}

export const checkUserPermission = (jwtConfig: JwtConfig, token: string, scopes?: string[]) => {
	const userData = jwtConfig.decryptToken<AuthTokenPayloadDto>(token)
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
	let jwtConfig: JwtConfig = iocContainer.get(JwtConfig)
	const token = request.body.token || request.query.token || request.headers['authorization']
	const check = request.query.check === 'true'
	try {
		if (securityName === 'jwt') {
			const userData = checkUserPermission(jwtConfig, token, scopes)
			if (check) {
				await authService.checkUserStatus(userData.userGuid)
			}
			request.userGuid = userData.userGuid
			request.role = userData.role
			return Promise.resolve({})
		}
		if (securityName === 'newUser') {
			const userData = checkUserPermission(jwtConfig, token, scopes)
			request.userGuid = userData.userGuid
			request.role = userData.role
			return Promise.resolve({})
		}
		if (securityName === 'subUserAuth') {
			const subUserData = jwtConfig.decryptToken<SubUserAuthTokenPayloadDto>(token)
			await authService.checkUserStatus(subUserData.parentUserGuid)
			request.subUserEmail = subUserData.subUserEmail
			request.parentUserGuid = subUserData.parentUserGuid
			return Promise.resolve({})
		}
		if (securityName === 'visitor') {
			const visitorData = jwtConfig.decryptToken<VisitorPassTokenPayloadDto>(token)
			request.visitorGuid = visitorData.visitorGuid
			return Promise.resolve({})
		}
	} catch (error: any) {
		console.log(error)
		return response.status(402).json({
			message: error.message,
			status: 402,
			data: null,
		})
	}
}
