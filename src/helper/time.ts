import { Timestamp } from 'firebase/firestore'
import moment from 'moment'
import { ITimeFormat } from '../common/constants'

export const convertDateStringToTimestamp = (dateString: string) => {
	if (!dateString) {
		return Timestamp.fromDate(moment().utc().toDate())
	}
	return Timestamp.fromDate(moment(dateString).utc().toDate())
}

export const convertTimestampToUserTimezone = (
	timestamp: Timestamp | null,
	timeFormat: string = ITimeFormat.isoDateTime,
) => {
	if (!timestamp) {
		return ''
	}
	return moment(timestamp.toDate()).utc().format(timeFormat)
}

export const getCurrentTimestamp = () => {
	return Timestamp.fromDate(moment().utc().toDate())
}

export const generateAllDatesInRange = (startDate: string, endDate: string): string[] => {
	const start = moment.utc(startDate)
	const end = moment.utc(endDate)
	const dateArray: string[] = []
	while (start.isSameOrBefore(end)) {
		dateArray.push(start.format(ITimeFormat.isoDateTime))
		start.add(1, 'day')
	}
	return dateArray
}

export const getCurrentDate = () => {
	return moment().utc().toDate()
}

export const getCurrentDateString = (dateFormat: string) => {
	return moment().utc().format(dateFormat)
}

// Convert a DateTimeOffset string to a Date object
export const convertDateStringToDate = (dateString: string) => {
	if (!dateString) return null
	return moment(dateString).utc().toDate()
}

// Convert a Date object to a formatted DateTimeOffset string
export const convertDateToDateString = (date: Date, dateFormat: string) => {
	if (!date) return ''
	return moment(date).format(dateFormat)
}

// Convert a DateTimeOffset string to a formatted DateTimeOffset string
export const convertDateStringToFormattedString = (dateString: string, dateFormat: string) => {
	if (!dateString) return ''
	return moment(dateString).utc().format(dateFormat)
}

// Get a formatted DateTimeOffset string from a Date object
export const getFormattedDateStringFromDate = (date: Date, dateFormat: string) => {
	if (!date) return ''
	return moment(date).format(dateFormat)
}

// Get relative time from now for a given date
export const getRelativeTimeFromNow = (date: Date) => {
	if (!date) return ''
	return moment.tz(date, 'Asia/Kuala_Lumpur').fromNow()
}

export const initializeDate = (date: Date) => {
	if (!date) return null
	return moment(date).startOf('day').toDate()
}

export const addTimeToDateString = (
	dateString: string,
	timeUnit: moment.unitOfTime.DurationConstructor,
	amount: number,
	dateFormat: string = ITimeFormat.isoDateTime,
): string => {
	if (!dateString) return ''
	return moment(dateString).utc().add(amount, timeUnit).format(dateFormat)
}
