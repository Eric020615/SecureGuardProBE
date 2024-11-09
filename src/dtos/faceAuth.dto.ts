import { GeneralFileDto } from "./index.dto";

export interface CreateUpdateFaceAuthDto {
    faceData: GeneralFileDto
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
	Remark3: String
}

export interface CardDto {
	BadgeCategory: 'MifareSector' | 'QRCode'
	Token: 'Card'
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

export interface CreateFaceAuthStaffDto {
	Card: CardDto
	AccessControlData: AccessControlDataDto
}