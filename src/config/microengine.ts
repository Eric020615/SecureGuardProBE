import * as dotenv from 'dotenv'

dotenv.config()

export const microEngineConfig = {
	identityApi: process.env.MICROENGINE_IDENTITY_API || '',
	deviceControlApi: process.env.MICROENGINE_DEVICE_CONTROL_API || '',
	cardDbManagementApi: process.env.MICROENGINE_CARD_DB_MANAGEMENT_API || '',
	cardDeviceCommApi: process.env.MICROENGINE_CARD_DEVICE_COMM_API || '',
	userId: process.env.MICROENGINE_USER_ID || '',
	password: process.env.MICROENGINE_USER_PASSWORD || '',
}

export enum IType {
	get = 'get',
	post = 'post',
	put = 'put',
	delete = 'delete',
	patch = 'patch',
}

export const listUrl = {
	identityApi: {
		auth: {
			login: {
				path: `${microEngineConfig.identityApi}/api/v1/Identity/login`,
				type: IType.post,
			},
			logout: {
				path: `${microEngineConfig.identityApi}/api/v1/Identity/logout`,
				type: IType.post,
			},
			refreshToken: {
				path: `${microEngineConfig.identityApi}/api/v1/Identity/refreshtoken`,
				type: IType.post,
			},
			terminateSession: {
				path: `${microEngineConfig.identityApi}/api/v1/Identity/terminatesession`,
				type: IType.post,
			},
		},
	},
	cardDbManagementApi: {
		users: {
			getAll: {
				path: `${microEngineConfig.cardDbManagementApi}/api/v1/Users`,
				type: IType.get,
			},
			getById: {
				path: `${microEngineConfig.cardDbManagementApi}/api/v1/Users/{userId}`,
				type: IType.get,
			},
			add: {
				path: `${microEngineConfig.cardDbManagementApi}/api/v1/Users`,
				type: IType.post,
			},
			update: {
				path: `${microEngineConfig.cardDbManagementApi}/api/v1/Users/{userId}`,
				type: IType.patch,
			},
			delete: {
				path: `${microEngineConfig.cardDbManagementApi}/api/v1/Users/{userId}`,
				type: IType.delete,
			},
			updateBadge: {
				path: `${microEngineConfig.cardDbManagementApi}/api/v1/Users/{userId}/card`,
				type: IType.patch,
			},
			getQrCode: {
				path: `${microEngineConfig.cardDbManagementApi}/api/v1/Users/{userId}/static-qr`,
				type: IType.get,
			},
			getOdata: {
				path: `${microEngineConfig.cardDbManagementApi}/api/v1/odata/Users{odataQueryString}`,
				type: IType.get,
			},
		},
	},
	cardDeviceCommApi: {
		commands: {
			queryStatus: {
				path: `${microEngineConfig.cardDeviceCommApi}/api/v1/staffs/device-comm/commands`,
				type: IType.get,
			},
			sendByStaffProfile: {
				path: `${microEngineConfig.cardDeviceCommApi}/api/v1/staffs/device-comm/send-by-staffprofile`,
				type: IType.post,
			},
			sendByBadgeNo: {
				path: `${microEngineConfig.cardDeviceCommApi}/api/v1/staffs/device-comm/send-by-badgeno`,
				type: IType.post,
			},
			sendByCardGuid: {
				path: `${microEngineConfig.cardDeviceCommApi}/api/v1/staffs/device-comm/send-by-cardguid`,
				type: IType.post,
			},
			clearCardDb: {
				path: `${microEngineConfig.cardDeviceCommApi}/api/v1/staffs/device-comm/clear-card-db`,
				type: IType.post,
			},
			deleteByBadgeProperties: {
				path: `${microEngineConfig.cardDeviceCommApi}/api/v1/staffs/device-comm/delete-by-badgeproperties`,
				type: IType.post,
			},
			sendByDoorAccess: {
				path: `${microEngineConfig.cardDeviceCommApi}/api/v1/staffs/device-comm/send-by-dooraccess`,
				type: IType.post,
			},
			sendByActivation: {
				path: `${microEngineConfig.cardDeviceCommApi}/api/v1/staffs/device-comm/send-by-activation`,
				type: IType.post,
			},
		},
	},
	deviceControlApi: {
		controllers: {
			getAll: {
				path: `${microEngineConfig.deviceControlApi}/api/v1/Devices/Controllers`,
				type: IType.get,
			},
			getById: {
				path: `${microEngineConfig.deviceControlApi}/api/v1/Devices/Controllers/{id}`,
				type: IType.get,
			},
			queryStatus: {
				path: `${microEngineConfig.deviceControlApi}/api/v1/Devices/Controllers/Command`,
				type: IType.get,
			},
		},
		doors: {
			getAll: {
				path: `${microEngineConfig.deviceControlApi}/api/v1/Devices/Doors`,
				type: IType.get,
			},
			getById: {
				path: `${microEngineConfig.deviceControlApi}/api/v1/Devices/Doors/{id}`,
				type: IType.get,
			},
			pulseOpen: {
				path: `${microEngineConfig.deviceControlApi}/api/v1/Devices/Doors/{id}/PulseOpen`,
				type: IType.post,
			},
			securityOn: {
				path: `${microEngineConfig.deviceControlApi}/api/v1/Devices/Doors/{id}/SecurityOn`,
				type: IType.post,
			},
			securityOff: {
				path: `${microEngineConfig.deviceControlApi}/api/v1/Devices/Doors/{id}/SecurityOff`,
				type: IType.post,
			},
			inhibitOn: {
				path: `${microEngineConfig.deviceControlApi}/api/v1/Devices/Doors/{id}/InhibitOn`,
				type: IType.post,
			},
			inhibitOff: {
				path: `${microEngineConfig.deviceControlApi}/api/v1/Devices/Doors/{id}/InhibitOff`,
				type: IType.post,
			},
		},
		outputs: {
			getAll: {
				path: `${microEngineConfig.deviceControlApi}/api/v1/Devices/Outputs`,
				type: IType.get,
			},
			getById: {
				path: `${microEngineConfig.deviceControlApi}/api/v1/Devices/Outputs/{id}`,
				type: IType.get,
			},
			sendCommand: {
				path: `${microEngineConfig.deviceControlApi}/api/v1/Devices/Outputs/SendCommand`,
				type: IType.post,
			},
		},
	},
}
