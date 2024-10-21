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

export const getNowTimestamp = () => {
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
};