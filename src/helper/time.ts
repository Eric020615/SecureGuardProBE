import { Timestamp } from "firebase/firestore";
import moment from "moment";
import "moment-timezone";

export const convertDateStringToTimestamp = (dateString: string) => {
  if(!dateString){
    return Timestamp.fromDate(new Date())
  }
  return Timestamp.fromDate(moment(dateString).utc().toDate())
}


export const convertTimestampToUserTimezone = (timestamp: Timestamp | null) => {
  if(!timestamp){
    return ""
  }
  return moment(timestamp.toDate()).utc().format('YYYY-MM-DD HH:mm:ss');
}

export const getNowTimestamp = () => {
  return Timestamp.fromDate(moment().utc().toDate());
}