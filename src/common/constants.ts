import { AccessControlDataDto, CardDto, CreateStaffDto, StaffProfileDto } from '../dtos/microengine.dto'

export enum PaginationDirectionEnum {
	Next = 'next',
	Previous = 'prev',
}

export enum FacilityEnum {
	BC = 1, // Badminton Court
	BBC = 2, // Basketball Court
	GR = 3, // Gym Room
}

export const FacilityDescriptions = {
	[FacilityEnum.BC]: 'Badminton Court',
	[FacilityEnum.BBC]: 'Basketball Court',
	[FacilityEnum.GR]: 'Gym Room',
}

export enum DocumentStatusEnum {
	ACTIVE = 1,
	SOFT_DELETED = 2,
	ARCHIVED = 3,
	PENDING = 4,
	DRAFT = 5,
	SUSPENDED = 6,
}

export const DocumentStatusDescriptions = {
	[DocumentStatusEnum.ACTIVE]: 'Active',
	[DocumentStatusEnum.SOFT_DELETED]: 'SoftDeleted',
	[DocumentStatusEnum.ARCHIVED]: 'Archived',
	[DocumentStatusEnum.PENDING]: 'Pending',
	[DocumentStatusEnum.DRAFT]: 'Draft',
	[DocumentStatusEnum.SUSPENDED]: 'Suspended',
}

export enum ParcelStatusEnum {
	Received = 1, // Parcel has been received by the concierge
	Stored = 2, // Parcel has been placed in the parcel room/storage
	Notified = 3, // Resident has been notified about the parcel
	PickedUp = 4, // Resident has collected the parcel
	Unclaimed = 5, // Parcel has not been claimed after a certain period
	ReturnedToSender = 6, // Parcel was returned to the sender
	Damaged = 7, // Parcel was received in a damaged condition
	Lost = 8, // Parcel has been misplaced or lost
}

export const ParcelStatusDescriptions = {
	[ParcelStatusEnum.Received]: 'Received',
	[ParcelStatusEnum.Stored]: 'Stored',
	[ParcelStatusEnum.Notified]: 'Notified',
	[ParcelStatusEnum.PickedUp]: 'PickedUp',
	[ParcelStatusEnum.Unclaimed]: 'Unclaimed',
	[ParcelStatusEnum.ReturnedToSender]: 'ReturnedToSender',
	[ParcelStatusEnum.Damaged]: 'Damaged',
	[ParcelStatusEnum.Lost]: 'Lost',
}

export enum VisitorCategoryEnum {
	FM = 1, // Family Members
	F = 2, // Friends
	R = 3, // Relatives
}

export const VisitorCategoryDescriptions = {
	[VisitorCategoryEnum.FM]: 'Family Members',
	[VisitorCategoryEnum.F]: 'Friends',
	[VisitorCategoryEnum.R]: 'Relatives',
}

export enum VisitStatusEnum {
	Scheduled = 1, // Visit is scheduled but hasn't occurred yet
	CheckedIn = 2, // Visitor has checked in
	CheckedOut = 3, // Visitor has checked out
	Cancelled = 4, // Visit has been cancelled
	NoShow = 5, // Visitor did not show up for the visit
}

export const VisitStatusDescriptions = {
	[VisitStatusEnum.Scheduled]: 'Scheduled',
	[VisitStatusEnum.CheckedIn]: 'CheckedIn',
	[VisitStatusEnum.CheckedOut]: 'CheckedOut',
	[VisitStatusEnum.Cancelled]: 'Cancelled',
	[VisitStatusEnum.NoShow]: 'NoShow',
}

export enum RoleIdEnum {
	SA = "SA",
	STF = "STF",
	RES = "RES",
	SUB = "SUB",
	VI = "VI",
}

export enum RoleEnum {
	SA = 1,
	STF = 2,
	RES = 3,
	SUB = 4,
	VI = 5,
}

export const RoleDescriptions = {
	[RoleEnum.SA]: 'System Admin',
	[RoleEnum.STF]: 'Staff',
	[RoleEnum.RES]: 'Resident',
	[RoleEnum.SUB]: 'Resident Subuser',
	[RoleEnum.VI]: 'Visitor',
}

export enum GenderEnum {
	M = 1,
	F = 2,
}

export const GenderDescriptions = {
	[GenderEnum.M]: 'Male',
	[GenderEnum.F]: 'Female',
}

// megeye
export enum RoleRecognitionTypeEnum {
	SA = 'staff',
	STF = 'staff',
	RES = 'staff',
	SUB = 'staff',
	VI = 'visitor',
}

// microengine
export enum DepartmentEnum {
	SA = 'Admin',
	STF = 'Security',
	RES = 'Tenant',
	SUB = 'Tenant',
	VI = 'Visitor',
}

export enum JobTitleEnum {
	SA = 'Manager',
	STF = 'Staff',
	RES = 'Resident',
	SUB = 'Resident',
	VI = 'Visitor',
}

export const ITimeFormat = {
	// Basic Date and Time Formats
	date: 'YYYY-MM-DD', // 2024-08-31
	time: 'HH:mm', // 14:30
	dateTime: 'YYYY-MM-DD HH:mm', // 2024-08-31 14:30

	// Extended Date and Time Formats
	dateTimeWithSeconds: 'YYYY-MM-DD HH:mm:ss', // 2024-08-31 14:30:45
	dateWithDay: 'dddd, YYYY-MM-DD', // Saturday, 2024-08-31
	dateTimeWithDay: 'dddd, YYYY-MM-DD HH:mm', // Saturday, 2024-08-31 14:30

	// Time with AM/PM
	time12Hour: 'hh:mm A', // 02:30 PM
	dateTime12Hour: 'YYYY-MM-DD hh:mm A', // 2024-08-31 02:30 PM
	dateTimeWithSeconds12Hour: 'YYYY-MM-DD hh:mm:ss A', // 2024-08-31 02:30:45 PM

	// Month and Year Formats
	monthYear: 'MMMM YYYY', // August 2024
	monthDayYear: 'MMMM DD, YYYY', // August 31, 2024
	shortMonthYear: 'MM/YYYY', // 08/2024

	// ISO 8601 Format
	isoDateTime: 'YYYY-MM-DDTHH:mm:ssZ', // 2024-08-31T14:30:45Z

	// Custom Formats
	dateShort: 'MM/DD/YYYY', // 08/31/2024
	timeWithOffset: 'HH:mm Z', // 14:30 +0800
	fullDateTime: 'ddd, MMMM DD, YYYY HH:mm', // Saturday, August 31, 2024 14:30

	// Week and Day of Year Formats
	weekOfYear: 'YYYY [Week] WW', // 2024 Week 35
	dayOfYear: 'YYYY [Day] DDD', // 2024 Day 243
}

export const StaffConst: CreateStaffDto = {
	Profile: {
		NRIC: '',
		Branch: 'HQ',
		Department: DepartmentEnum.SA,
		Division: 'N/Available',
		JobTitle: JobTitleEnum.SA,
		Company: 'Microengine',
		EmailAddress: '',
		ContactNo: '',
		AttendanceDoorGroup: 'All Doors',
		HolidaySet: 'Default',
		Shift: 'Default',
		VehicleNo: '',
		ParkingLot: '',
		Remark1: '',
		Remark2: '',
		Remark3: '',
		UserDefinedField1: '',
		UserDefinedField2: '',
		UserDefinedField3: '',
		UserDefinedField4: '',
		UserDefinedField5: '',
		UserDefinedField6: '',
		UserDefinedField7: '',
		UserDefinedField8: '',
	} as StaffProfileDto,
	Card: {
		BadgeCategory: 'ISO14443ACSN',
		Token: 'Card',
		BadgeNo: '',
		CardSerialNo: '',
		CardGuid: 0,
		QRCodeType: 'Static',
	} as CardDto,
	AccessControlData: {
		AccessEntryDate: '',
		AccessExitDate: '',
		IsActive: true,
		LockedOutEnabled: false,
		AntipassbackEnabled: false,
		IsSuperCard: false,
		CanPerformGuardTour: false,
		AllowFPIdentification: false,
		DoorAccessRightId: '0001',
		FloorAccessRightId: '001',
		DefaultFloorGroupId: 'N/Available',
		PinNo: null,
	} as AccessControlDataDto,
	UserId: '',
	UserName: '',
	UserType: '',
}
