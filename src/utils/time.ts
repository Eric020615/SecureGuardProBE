import { Timestamp } from "firebase/firestore";
import moment from "moment";
import "moment-timezone";

const serverTimezone = "Asia/Kuala_Lumpur"

export const convertDateStringToTimestamp = (dateString: string) => {
  if(!dateString){
    return null
  }
  return Timestamp.fromDate(moment(dateString).toDate())
}


export const convertTimestampToUserTimezone = (timestamp: Timestamp) => {
  if(!timestamp){
    return ""
  }
  return moment(timestamp.toDate()).tz(serverTimezone).format('YYYY-MM-DD HH:mm:ss');
}

export const getNowTimestamp = () => {
  return Timestamp.fromDate(moment().tz(serverTimezone).toDate());
}