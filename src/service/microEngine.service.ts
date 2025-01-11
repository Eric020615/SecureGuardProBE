import axios from 'axios'
import { provideSingleton } from '../helper/provideSingleton'
import { IType, listUrl, microEngineConfig } from '../config/microengine'
import {
	CreateStaffDto,
	GetStaffDto,
	GetStaticQrCodeDto,
	IODataQueryStringResponse,
	IResponse,
	LoginResponse,
	RefreshTokenResponse,
	SendByCardGuidDto,
	TerminateUserRequest,
} from '../dto/microengine.dto'
import moment from 'moment'
import { convertDateStringToDate } from '../helper/time'
import { HttpStatusCode } from '../common/http-status-code'
import { OperationError } from '../common/operation-error'

@provideSingleton(MicroEngineService)
export class MicroEngineService {
	private apiKey: string
	private refreshToken: string
	private expiresAt: Date | null

	constructor() {
		this.apiKey = ''
		this.refreshToken = ''
		this.expiresAt = null
	}

	private async apiRequest<T>(url: string, method: IType, data?: any, params?: any): Promise<T | null> {
		try {
			await this.validateOrRefreshToken()
			const response = await axios({
				method: method,
				url,
				data: data,
				headers: {
					'Content-Type': 'application/json',
					...{ Authorization: `Bearer ${this.apiKey}` },
				},
				params: params,
				paramsSerializer: (params) => this.parseParams(params),
			})
			return response.data
		} catch (error: any) {
			if (axios.isAxiosError(error)) {
				const errorMessage = error.response?.data?.Message || error.message
				console.log(errorMessage)
			}
			return null
		}
	}

	private async authApiRequest<T>(
		url: string,
		method: IType,
		data?: any,
		params?: any,
		headers?: Record<string, string>,
	): Promise<T | null> {
		try {
			const response = await axios({
				method: method,
				url,
				data: data,
				headers: {
					'Content-Type': 'application/json-patch+json',
					...(headers ? headers : this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
				},
				params: params,
				paramsSerializer: (params) => this.parseParams(params),
			})
			return response.data
		} catch (error: any) {
			if (axios.isAxiosError(error)) {
				const errorMessage = error.response?.data?.Message || error.message
				console.log(errorMessage)
			}
			return null
		}
	}

	private parseParams(params: any): string {
		const data = Object.keys(params)
			.filter((key) => params[key] !== undefined && params[key] !== null && params[key] !== '')
			.map((key) => {
				return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
			})
			.join('&')
		return data
	}

	private async loginWithBasicAuth(): Promise<void> {
		try {
			const credentials = Buffer.from(`${microEngineConfig.userId}:${microEngineConfig.password}`).toString('base64')
			const response = await this.authApiRequest<IResponse<LoginResponse>>(
				listUrl.identityApi.auth.login.path,
				listUrl.identityApi.auth.login.type,
				{},
				undefined,
				{
					Authorization: `Basic ${credentials}`,
				},
			)
			if (!response) {
				throw new Error('Failed to login with basic auth for microengine.')
			}
			this.apiKey = response.Result?.AccessToken ? response.Result.AccessToken : ''
			this.refreshToken = response.Result?.RefreshToken ? response.Result.RefreshToken : ''
			this.expiresAt = convertDateStringToDate(response.Result?.ExpiresAt ? response.Result.ExpiresAt : '')
		} catch (error: any) {
			throw new Error(error)
		}
	}

	// take note of this
	private async refreshAccessToken(): Promise<void> {
		const response = await this.authApiRequest<IResponse<RefreshTokenResponse>>(
			listUrl.identityApi.auth.refreshToken.path,
			listUrl.identityApi.auth.refreshToken.type,
			{ refreshToken: this.refreshToken },
			undefined,
			{
				Authorization: `Bearer ${this.apiKey}`,
			},
		)
		if (!response) {
			throw new Error('Failed to refresh token in microengine.')
		}
		this.apiKey = response.Result?.AccessToken || ''
		this.refreshToken = response.Result?.RefreshToken || ''
		this.expiresAt = convertDateStringToDate(response.Result?.ExpiresAt || '')
	}

	private async validateOrRefreshToken() {
		try {
			if (!this.refreshToken || !this.expiresAt || !this.apiKey) {
				await this.terminateSession()
				await this.loginWithBasicAuth()
			}
			if (this.expiresAt) {
				// if expires, refresh token
				if (this.expiresAt && moment().isAfter(this.expiresAt)) {
					await this.refreshAccessToken()
				}
			}
		} catch (error) {
			console.log(error)
		}
	}

	async logout() {
		return this.authApiRequest(listUrl.identityApi.auth.logout.path, listUrl.identityApi.auth.logout.type)
	}

	async terminateSession() {
		const response = await this.authApiRequest<IResponse<TerminateUserRequest>>(
			listUrl.identityApi.auth.terminateSession.path,
			listUrl.identityApi.auth.terminateSession.type,
			{ UserId: microEngineConfig.userId },
		)
		if (!response) {
			throw new Error('Failed to terminateSession microengine.')
		}
		if (response.StatusCode === HttpStatusCode.OK) {
			this.apiKey = ''
			this.refreshToken = ''
			this.expiresAt = null
		}
	}

	// Card DB Management API - Users Endpoints
	async getAllUsers() {
		return this.apiRequest(listUrl.cardDbManagementApi.users.getAll.path, listUrl.cardDbManagementApi.users.getAll.type)
	}

	async getUserById(userId: string) {
		try {
			const url = listUrl.cardDbManagementApi.users.getById.path.replace('{userId}', userId)
			const data = await this.apiRequest<IResponse<GetStaffDto>>(url, listUrl.cardDbManagementApi.users.getById.type)
			return data
		} catch (error) {
			return null
		}
	}

	async addUser(data: CreateStaffDto, badgeNumber: string) {
		try {
			const odataQuery = `$filter=UserId eq '${data.UserId}' and Cards/any(c: c/BadgeNo eq '${badgeNumber}')`
			const response = await this.getUserOdata(odataQuery)
			if (response && response.value.length > 0) {
				throw new Error(`User with UserId ${data.UserId} and BadgeNo ${badgeNumber} already exists.`)
			}
			data = {
				...data,
				Card: {
					...data.Card,
					BadgeNo: badgeNumber,
				},
			}
			await this.apiRequest(
				listUrl.cardDbManagementApi.users.add.path,
				listUrl.cardDbManagementApi.users.add.type,
				JSON.stringify(data),
			)
		} catch (error) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	async updateUser(userId: string, data: any) {
		const url = listUrl.cardDbManagementApi.users.update.path.replace('{userId}', userId)
		return this.apiRequest(url, listUrl.cardDbManagementApi.users.update.type, data)
	}

	async deleteUser(userId: string) {
		const url = listUrl.cardDbManagementApi.users.delete.path.replace('{userId}', userId)
		return this.apiRequest(url, listUrl.cardDbManagementApi.users.delete.type)
	}

	async updateBadge(userId: string, data: any) {
		const url = listUrl.cardDbManagementApi.users.updateBadge.path.replace('{userId}', userId)
		return this.apiRequest(url, listUrl.cardDbManagementApi.users.updateBadge.type, data)
	}

	async getUserQrCode(userId: string, badgeNumber?: string, cardGuid?: string) {
		try {
			const url = listUrl.cardDbManagementApi.users.getQrCode.path.replace('{userId}', userId)
			const data = await this.apiRequest<IResponse<GetStaticQrCodeDto>>(
				url,
				listUrl.cardDbManagementApi.users.getQrCode.type,
				undefined,
				{
					BadgeNo: badgeNumber,
					CardGuid: cardGuid,
				},
			)
			return data
		} catch (error) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	async getUserOdata(odataQueryString: string) {
		try {
			const url = listUrl.cardDbManagementApi.users.getOdata.path.replace('{odataQueryString}', odataQueryString)
			const response = await this.apiRequest<IODataQueryStringResponse<GetStaffDto>>(
				url,
				listUrl.cardDbManagementApi.users.getOdata.type,
			)
			return response
		} catch (error: any) {
			if (error.response && error.response.status === 500) {
				return {
					'@odata.context': '',
					value: [],
				} as IODataQueryStringResponse<GetStaffDto>
			}
		}
	}

	// Card Device Comm API - Commands Endpoints
	async queryStatus() {
		return this.apiRequest(
			listUrl.cardDeviceCommApi.commands.queryStatus.path,
			listUrl.cardDeviceCommApi.commands.queryStatus.type,
		)
	}

	async sendByStaffProfile(data: any) {
		return this.apiRequest(
			listUrl.cardDeviceCommApi.commands.sendByStaffProfile.path,
			listUrl.cardDeviceCommApi.commands.sendByStaffProfile.type,
			data,
		)
	}

	async sendByBadgeNo(data: any) {
		return this.apiRequest(
			listUrl.cardDeviceCommApi.commands.sendByBadgeNo.path,
			listUrl.cardDeviceCommApi.commands.sendByBadgeNo.type,
			data,
		)
	}

	async sendByCardGuid() {
		let data = {
			StartCardGuid: 0,
			EndCardGuid: 0,
			Action: 'InstallCard',
			ControllerId: 'Demo',
			IsAllCard: true,
			SelectiveDownload: true,
		} as SendByCardGuidDto
		return this.apiRequest(
			listUrl.cardDeviceCommApi.commands.sendByCardGuid.path,
			listUrl.cardDeviceCommApi.commands.sendByCardGuid.type,
			data,
		)
	}

	async clearCardDb() {
		return this.apiRequest(
			listUrl.cardDeviceCommApi.commands.clearCardDb.path,
			listUrl.cardDeviceCommApi.commands.clearCardDb.type,
		)
	}

	async deleteByBadgeProperties(data: any) {
		return this.apiRequest(
			listUrl.cardDeviceCommApi.commands.deleteByBadgeProperties.path,
			listUrl.cardDeviceCommApi.commands.deleteByBadgeProperties.type,
			data,
		)
	}

	async sendByDoorAccess(data: any) {
		return this.apiRequest(
			listUrl.cardDeviceCommApi.commands.sendByDoorAccess.path,
			listUrl.cardDeviceCommApi.commands.sendByDoorAccess.type,
			data,
		)
	}

	async sendByActivation(data: any) {
		return this.apiRequest(
			listUrl.cardDeviceCommApi.commands.sendByActivation.path,
			listUrl.cardDeviceCommApi.commands.sendByActivation.type,
			data,
		)
	}

	// Device Control API - Controllers Endpoints
	async getAllControllers() {
		return this.apiRequest(
			listUrl.deviceControlApi.controllers.getAll.path,
			listUrl.deviceControlApi.controllers.getAll.type,
		)
	}

	async getControllerById(controllerId: string) {
		const url = listUrl.deviceControlApi.controllers.getById.path.replace('{id}', controllerId)
		return this.apiRequest(url, listUrl.deviceControlApi.controllers.getById.type)
	}

	async queryControllerStatus() {
		return this.apiRequest(
			listUrl.deviceControlApi.controllers.queryStatus.path,
			listUrl.deviceControlApi.controllers.queryStatus.type,
		)
	}

	// Device Control API - Doors Endpoints
	async getAllDoors() {
		return this.apiRequest(listUrl.deviceControlApi.doors.getAll.path, listUrl.deviceControlApi.doors.getAll.type)
	}

	async getDoorById(doorId: string) {
		const url = listUrl.deviceControlApi.doors.getById.path.replace('{id}', doorId)
		return this.apiRequest(url, listUrl.deviceControlApi.doors.getById.type)
	}

	async pulseOpenDoor(doorId: string) {
		const url = listUrl.deviceControlApi.doors.pulseOpen.path.replace('{id}', doorId)
		return this.apiRequest(url, listUrl.deviceControlApi.doors.pulseOpen.type)
	}

	async securityOn(doorId: string) {
		const url = listUrl.deviceControlApi.doors.securityOn.path.replace('{id}', doorId)
		return this.apiRequest(url, listUrl.deviceControlApi.doors.securityOn.type)
	}

	async securityOff(doorId: string) {
		const url = listUrl.deviceControlApi.doors.securityOff.path.replace('{id}', doorId)
		return this.apiRequest(url, listUrl.deviceControlApi.doors.securityOff.type)
	}

	async inhibitOn(doorId: string) {
		const url = listUrl.deviceControlApi.doors.inhibitOn.path.replace('{id}', doorId)
		return this.apiRequest(url, listUrl.deviceControlApi.doors.inhibitOn.type)
	}

	async inhibitOff(doorId: string) {
		const url = listUrl.deviceControlApi.doors.inhibitOff.path.replace('{id}', doorId)
		return this.apiRequest(url, listUrl.deviceControlApi.doors.inhibitOff.type)
	}

	// Device Control API - Outputs Endpoints
	async getAllOutputs() {
		return this.apiRequest(listUrl.deviceControlApi.outputs.getAll.path, listUrl.deviceControlApi.outputs.getAll.type)
	}

	async getOutputById(outputId: string) {
		const url = listUrl.deviceControlApi.outputs.getById.path.replace('{id}', outputId)
		return this.apiRequest(url, listUrl.deviceControlApi.outputs.getById.type)
	}

	async sendCommand(data: any) {
		return this.apiRequest(
			listUrl.deviceControlApi.outputs.sendCommand.path,
			listUrl.deviceControlApi.outputs.sendCommand.type,
			data,
		)
	}
}
