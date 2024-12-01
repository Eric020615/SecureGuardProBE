import { AccessControlDataDto, CardDto, CreateStaffDto, StaffProfileDto } from '../dtos/microengine.dto'

export enum PaginationDirectionEnum {
	Next = 'next',
	Previous = 'prev',
}

export enum FacilityEnum {
	BC = 'Badminton Court',
	BBC = 'Basketball Court',
	GR = 'Gym Room',
}

export enum DocumentStatusEnum {
	Active = 'Active',
	SoftDeleted = 'SoftDeleted',
	Archived = 'Archived',
	Pending = 'Pending',
	Draft = 'Draft',
	Suspended = 'Suspended',
}

export enum RoleRecognitionTypeEnum {
	SA = 'staff',
	STF = 'staff',
	RES = 'staff',
	SUB = 'staff',
	VI = 'visitor',
}

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

export enum ParcelStatusEnum {
	Received = 'Received', // Parcel has been received by the concierge
	Stored = 'Stored', // Parcel has been placed in the parcel room/storage
	Notified = 'Notified', // Resident has been notified about the parcel
	PickedUp = 'PickedUp', // Resident has collected the parcel
	Unclaimed = 'Unclaimed', // Parcel has not been claimed after a certain period
	ReturnedToSender = 'ReturnedToSender', // Parcel was returned to the sender
	Damaged = 'Damaged', // Parcel was received in a damaged condition
	Lost = 'Lost', // Parcel has been misplaced or lost
}

export enum VisitStatusEnum {
	Scheduled = 'Scheduled', // Visit is scheduled but hasn't occurred yet
	CheckedIn = 'CheckedIn', // Visitor has checked in
	CheckedOut = 'CheckedOut', // Visitor has checked out
	Cancelled = 'Cancelled', // Visit has been cancelled
	NoShow = 'NoShow', // Visitor did not show up for the visit
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
