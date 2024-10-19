export enum DocumentStatus {
	Active = 1,
	SoftDeleted = 0,
	Archived = -1,
	Pending = 2,
	Draft = 3,
	Suspended = 4,
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
