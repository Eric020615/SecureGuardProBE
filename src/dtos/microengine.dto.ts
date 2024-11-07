export interface IResponse<T> {
	Message?: string
	Result?: T
	StatusCode: number
}

export interface IODataQueryStringResponse<T> {
	"@odata.context": string
	value: T[]
}

export interface LoginResponse {
	UserId?: string // nullable
	AccessToken?: string // nullable
	RefreshToken?: string // nullable
	ExpiresAt?: string // $date-time
}

export interface RefreshTokenRequest {
	RefreshToken?: string // nullable
}

export interface RefreshTokenResponse {
	UserId?: string // nullable
	AccessToken?: string // nullable
	RefreshToken?: string // nullable
	ExpiresAt?: string // $date-time
}

export interface TerminateUserRequest {
	UserId: string // required
}

export interface SoftwareInfoResponse {
	Version?: string // nullable
}

export interface StaffProfileDto {
	NRIC: string
	Branch: 'HQ'
	Department: 'Admin' | 'Security' | 'Tenant'
	Division: 'N/Available'
	JobTitle: 'Manager' | 'Staff' | 'Resident'
	Company: 'Microengine'
	EmailAddress: string
	ContactNo: string
	AttendanceDoorGroup: 'All Doors'
	HolidaySet: 'Default'
	Shift: 'Default'
	VehicleNo: string
	ParkingLot: string
	Remark1: string
	Remark2: string
	Remark3: string
	UserDefinedField1: string
	UserDefinedField2: string
	UserDefinedField3: string
	UserDefinedField4: string
	UserDefinedField5: string
	UserDefinedField6: string
	UserDefinedField7: string
	UserDefinedField8: string
}

export interface CardDto {
	BadgeCategory: 'MifareSector' | 'QRCode'
	Token: 'Card'
	BadgeNo: string
	CardSerialNo: string
	CardGuid: number
	QRCodeType: 'Dynamic' | 'Static'
}

export interface AccessControlDataDto {
	AccessEntryDate: string
	AccessExitDate: string
	IsActive: boolean
	LockedOutEnabled: boolean
	AntipassbackEnabled: boolean
	IsSuperCard: boolean
	CanPerformGuardTour: boolean
	AllowFPIdentification: boolean
	DoorAccessRightId: '0000' | '0001'
	FloorAccessRightId: '000' | '001'
	DefaultFloorGroupId: 'N/Available'
	PinNo: string | null
}

export interface CreateStaffDto {
	Profile: StaffProfileDto
	Card: CardDto
	AccessControlData: AccessControlDataDto
	UserId: string
	UserName: string
	UserType: string
}

export interface GetStaffDto {
	Profile: StaffProfileDto
	Card: CardDto
	AccessControlData: AccessControlDataDto
	Photo: string | null
	UserId: string
	UserName: string
	UserType: string
}