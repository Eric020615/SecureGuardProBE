import * as dotenv from 'dotenv'
import { Cookie, CookieJar } from 'tough-cookie'
import { wrapper } from 'axios-cookiejar-support'
import axios, { AxiosInstance, AxiosResponse } from 'axios'
import queryString from 'querystring'
import CryptoJS from 'crypto-js'
import { provideSingleton } from '../helper/provideSingleton'

dotenv.config()

@provideSingleton(MegeyeManager)
export class MegeyeManager {
	private cookieJar: CookieJar
	public client: AxiosInstance
	private megeyeConfig = {
		apiBaseUrl: process.env.MEGEYE_API_BASE_URL || '',
		cookieDomain: process.env.MEGEYE_COOKIE_DOMAIN || '',
		megeyeUsername: process.env.MEGEYE_USERNAME || '',
		megeyePassword: process.env.MEGEYE_PASSWORD || '',
	}
	private lastRequestTime: number | null = null
	private cookieExpiryTime = 5 * 60 * 1000 // 5 minutes in milliseconds

	constructor() {
		this.cookieJar = new CookieJar()
		this.client = wrapper(
			axios.create({
				jar: this.cookieJar,
				withCredentials: true,
			}),
		)
	}

	public setCookie(sessionID: string): void {
		const cookie = new Cookie({
			key: 'sessionID',
			value: sessionID,
			domain: this.megeyeConfig.cookieDomain,
			path: '/',
			httpOnly: true,
			maxAge: 3600,
		})

		try {
			this.cookieJar.setCookie(cookie, this.megeyeConfig.apiBaseUrl, (err) => {
				if (err) {
					console.warn('Failed to set cookie:', err)
				}
			})
		} catch (error) {
			console.warn('Failed to set cookie:', error)
		}
	}

	public async getCookie(): Promise<string | null> {
		try {
			const cookieString = await this.cookieJar.getCookieString(this.megeyeConfig.apiBaseUrl)
			// Parse the cookie string to find the desired cookie
			const cookies = cookieString.split(';').map((cookie) => cookie.trim())
			const targetCookie = cookies.find((cookie) => cookie.startsWith('sessionID='))
			return targetCookie || null
		} catch (error) {
			console.warn('Failed to retrieve cookie:', error)
		}
		return null
	}

	public async requestNewCookie(): Promise<void> {
		try {
			// can I make the cookie as null like clear all things
			this.cookieJar.removeAllCookies()
			// get salt, challenge and temp session_id
			const challengeResponse = await this.client.get(`${this.megeyeConfig.apiBaseUrl}/api/auth/login/challenge`, {
				params: {
					username: this.megeyeConfig.megeyeUsername,
				},
			})
			if (challengeResponse.status !== 200) {
				throw new Error('Failed to obtain challenge')
			}
			const { session_id, salt, challenge } = challengeResponse.data
			const combination = this.megeyeConfig.megeyePassword + salt + challenge
			const encryptedPassword = CryptoJS.SHA256(combination).toString()
			// get session_id
			const response = await this.client.post(`${this.megeyeConfig.apiBaseUrl}/api/auth/login`, {
				session_id: session_id,
				username: this.megeyeConfig.megeyeUsername,
				password: encryptedPassword,
			})
			if (response.status !== 200) {
				throw new Error('Failed to obtain new cookie')
			}
			this.setCookie(response.data.session_id)
		} catch (error) {
			console.log('Failed to obtain new cookie:', error)
			throw error
		}
	}

	// Checks if the cookie needs to be refreshed
	public async ensureValidCookie() {
		const currentTime = Date.now()
		if (!this.lastRequestTime || currentTime - this.lastRequestTime > this.cookieExpiryTime) {
			// Refresh the cookie if no request has been made for more than 5 minutes
			await this.requestNewCookie()
			this.lastRequestTime = currentTime // Update the last request time
		}
	}

	// Handler function to perform requests
	public async MegeyeGlobalHandler(payload: IHandler): Promise<[boolean, any]> {
		await this.ensureValidCookie()
		const client = this.client
		const _handler = async (payload: IHandler): Promise<[boolean, any]> => {
			try {
				const { path, type, data, isBloob } = payload
				const token = payload._token
				const baseURL = `${this.megeyeConfig.apiBaseUrl}${path}`
				let success = false
				const maxAttempt = 1
				let attempt = 0

				const performRequest = async (): Promise<AxiosInstance> => {
					let response: AxiosResponse = {} as AxiosResponse
					// while (!success && attempt < maxAttempt) {
					// 	attempt++
					try {
						// Perform the API request
						if (type === 'get') {
							response = await client.get(baseURL, {
								params: data,
								responseType: isBloob ? 'blob' : 'json',
								paramsSerializer: (params) => this.parseParams(params),
								headers: {
									'Content-Type': 'application/json',
									...(token != null
										? {
												Authorization: `${token}`,
										  }
										: {}),
								},
							})
						} else if (type === 'put') {
							response = await client.put(baseURL, payload.isUrlencoded ? queryString.stringify(data) : data, {
								headers: {
									'Content-Type': payload.isFormData
										? 'multipart/form-data'
										: payload.isUrlencoded
										? 'application/x-www-form-urlencoded'
										: 'application/json',
									...(token != null
										? {
												Authorization: `${token}`,
										  }
										: {}),
								},
								params: payload.params,
								paramsSerializer: (params) => this.parseParams(params),
							})
						} else if (type === 'patch') {
							response = await client.patch(baseURL, payload.isUrlencoded ? queryString.stringify(data) : data, {
								headers: {
									'Content-Type': payload.isFormData
										? 'multipart/form-data'
										: payload.isUrlencoded
										? 'application/x-www-form-urlencoded'
										: 'application/json',
									...(token != null
										? {
												Authorization: `${token}`,
										  }
										: {}),
								},
							})
						} else if (type === 'delete') {
							response = await client.delete(baseURL, {
								headers: {
									'Content-Type': payload.isFormData
										? 'multipart/form-data'
										: payload.isUrlencoded
										? 'application/x-www-form-urlencoded'
										: 'application/json',
									...(token != null
										? {
												Authorization: `${token}`,
										  }
										: {}),
								},
								data: data,
							})
						} else {
							response = await client.post(baseURL, data, {
								headers: {
									'Content-Type': payload.isFormData
										? 'multipart/form-data'
										: payload.isUrlencoded
										? 'application/x-www-form-urlencoded'
										: 'application/json',
									...(token != null
										? {
												Authorization: `${token}`,
										  }
										: {}),
								},
								params: payload.params,
								paramsSerializer: (params) => this.parseParams(params),
							})
						}
						success = true
					} catch (error: any) {
						response = error.response
						console.log(error.response.data)
					}
					if (!success) {
						console.log('All attempts to perform request failed')
					}
					return response.data
				}

				const response = await performRequest()
				return [success, response]
			} catch (error: any) {
				return [false, error]
			}
		}

		const data = await _handler(payload)
		return data
	}

	// Helper function to serialize parameters for URL
	public parseParams(params: any): string {
		let options = ''

		Object.keys(params).forEach((key) => {
			const value = params[key]
			if (Array.isArray(value)) {
				value.forEach((element) => {
					if (Array.isArray(element)) {
						element.forEach((subElement) => {
							options += `${key}=${subElement}&`
						})
					} else {
						options += `${key}=${element}&`
					}
				})
			} else {
				options += `${key}=${value}&`
			}
		})
		return options ? options.slice(0, -1) : options
	}
}

// Define the interface for the request handler
interface IHandler {
	path: string
	type: string
	data?: any
	params?: any
	_token?: string
	isFormData?: boolean
	isUrlencoded?: boolean
	isBloob?: boolean
}

// Define the interface for the response
export interface IResponse<T> {
	success: boolean
	msg: string
	data: T
}

interface map {
	[key: string]: string
}
export const IType: map = {
	get: 'get',
	post: 'post',
	put: 'put',
	delete: 'delete',
	patch: 'patch',
}

export const listUrl = {
	personnelManagement: {
		create: {
			path: '/api/persons/item',
			type: IType.post,
		},
		edit: {
			path: '/api/persons/item/{id}',
			type: IType.put,
		},
		delete: {
			path: '/api/persons/item/{id}',
			type: IType.delete,
		},
		queryPersonDetailsById: {
			path: '/api/persons/item/{id}',
			type: IType.get,
		},
		query: {
			path: '/api/persons/query',
			type: IType.post,
		},
	},
}
