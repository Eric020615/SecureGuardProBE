// services/MicroengineService.ts
import axios from 'axios'
import { provideSingleton } from '../helper/provideSingleton'
import { IType, listUrl, microEngineConfig } from '../config/microengine'
import {
	CreateStaffDto,
	GetStaffDto,
	IODataQueryStringResponse,
	IResponse,
	LoginResponse,
	RefreshTokenResponse,
	TerminateUserRequest,
} from '../dtos/microengine.dto'
import moment from 'moment'
import { convertDateStringToDate, getCurrentTimestamp } from '../helper/time'
import { HttpStatusCode } from '../common/http-status-code'
import { inject } from 'inversify'
import { CardRepository } from '../repositories/card.repository'
import { Card } from '../models/card.model'
import { DocumentStatus } from '../common/constants'
import { stringify } from 'query-string/base'

@provideSingleton(MicroEngineService)
export class MicroEngineService {
	private apiKey: string
	private refreshToken: string
	private expiresAt: Date | null

	constructor(
		@inject(CardRepository)
		private cardRepository: CardRepository,
	) {
		this.apiKey = ''
		this.refreshToken = ''
		this.expiresAt = null
	}

	private async apiRequest<T>(url: string, method: IType, data?: any, params?: any): Promise<T> {
		await this.validateOrRefreshToken()
		try {
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
				console.warn(errorMessage)
				throw new Error(`Request failed: ${errorMessage}`)
			} else {
				throw new Error('An unexpected error occurred')
			}
		}
	}

	private async authApiRequest<T>(
		url: string,
		method: IType,
		data?: any,
		params?: any,
		headers?: Record<string, string>,
	): Promise<T> {
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
				console.warn(errorMessage)
				throw new Error(errorMessage)
			} else {
				throw new Error('An unexpected error occurred')
			}
		}
	}

	private parseParams(params: any): string {
		return new URLSearchParams(params).toString()
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
			this.apiKey = response.Result?.AccessToken ? response.Result.AccessToken : ''
			this.refreshToken = response.Result?.RefreshToken ? response.Result.RefreshToken : ''
			this.expiresAt = convertDateStringToDate(response.Result?.ExpiresAt ? response.Result.ExpiresAt : '')
		} catch (error: any) {
			throw new Error(error)
		}
	}

	private async refreshAccessToken(): Promise<void> {
		const response = await this.authApiRequest<IResponse<RefreshTokenResponse>>(
			listUrl.identityApi.auth.refreshToken.path,
			listUrl.identityApi.auth.refreshToken.type,
			{ refreshToken: this.refreshToken },
		)
		this.apiKey = response.Result?.AccessToken || ''
		this.refreshToken = response.Result?.RefreshToken || ''
		this.expiresAt = convertDateStringToDate(response.Result?.ExpiresAt || '')
	}

	private async validateOrRefreshToken() {
		if (!this.refreshToken || !this.expiresAt || !this.apiKey) {
			await this.terminateSession()
			await this.loginWithBasicAuth()
		}
		if (this.expiresAt) {
			// if expires, refresh token
			if (this.expiresAt && moment().isAfter(this.expiresAt)) {
				this.refreshAccessToken()
			}
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
		const url = listUrl.cardDbManagementApi.users.getById.path.replace('{userId}', userId)
		return this.apiRequest(url, listUrl.cardDbManagementApi.users.getById.type)
	}

	async addUser(data: CreateStaffDto, userGuid: string) {
		const badgeNumber = await this.cardRepository.createCardRepository(
			new Card(0, 0, DocumentStatus.Active, userGuid, userGuid, getCurrentTimestamp(), getCurrentTimestamp()),
		)
		const odataQuery = `$filter=UserId eq '${data.UserId}' and Cards/any(c: c/BadgeNo eq '${badgeNumber}'`
		const response = await this.getUserOdata(odataQuery)
		if (response.value.length > 0) {
			throw new Error(`User with UserId ${data.UserId} and BadgeNo ${badgeNumber} already exists.`)
		}
		data = {
			...data,
			Card: {
				...data.Card,
				BadgeNo: badgeNumber.toString(),
			},
		}
		return this.apiRequest(
			listUrl.cardDbManagementApi.users.add.path,
			listUrl.cardDbManagementApi.users.add.type,
			JSON.stringify(data),
		)
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

	async getUserQrCode(userId: string) {
		const url = listUrl.cardDbManagementApi.users.getQrCode.path.replace('{userId}', userId)
		return this.apiRequest(url, listUrl.cardDbManagementApi.users.getQrCode.type)
	}

	async getUserOdata(odataQueryString: string) {
		const url = listUrl.cardDbManagementApi.users.getOdata.path.replace('{odataQueryString}', odataQueryString)
		return this.apiRequest<IODataQueryStringResponse<GetStaffDto>>(url, listUrl.cardDbManagementApi.users.getOdata.type)
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

	async sendByCardGuid(data: any) {
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
