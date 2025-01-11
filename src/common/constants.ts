import { AccessControlDataDto, CardDto, CreateStaffDto, StaffProfileDto } from '../dto/microengine.dto'

export enum PaginationDirectionEnum {
	Next = 'next',
	Previous = 'prev',
}

export enum FacilityEnum {
	BC = 1, // Badminton Court
	BBC = 2, // Basketball Court
	GR = 3, // Gym Room
}

export enum DocumentStatusEnum {
	ACTIVE = 1,
	SOFT_DELETED = 2,
	ARCHIVED = 3,
	PENDING = 4,
	DRAFT = 5,
	SUSPENDED = 6,
}

export enum ParcelStatusEnum {
	RECEIVED = 1, // Parcel has been received by the concierge
	STORED = 2, // Parcel has been placed in the parcel room/storage
	NOTIFIED = 3, // Resident has been notified about the parcel
	PICKED_UP = 4, // Resident has collected the parcel
	UNCLAIMED = 5, // Parcel has not been claimed after a certain period
	RETURNED_TO_SENDER = 6, // Parcel was returned to the sender
	DAMAGED = 7, // Parcel was received in a damaged condition
	LOST = 8, // Parcel has been misplaced or lost
}

export enum VisitorCategoryEnum {
	FM = 1, // Family Members
	F = 2, // Friends
	R = 3, // Relatives
}

export enum VisitStatusEnum {
	Scheduled = 1, // Visit is scheduled but hasn't occurred yet
	CheckedIn = 2, // Visitor has checked in
	CheckedOut = 3, // Visitor has checked out
	Cancelled = 4, // Visit has been cancelled
	NoShow = 5, // Visitor did not show up for the visit
}

export enum RoleEnum {
	SA = 1,
	STF = 2,
	RES = 3,
	SUB = 4,
	VI = 5,
}

export enum GenderEnum {
	M = 1,
	F = 2,
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
