import { Timestamp } from "firebase/firestore";
import moment from "moment";
import "moment-timezone";

const userTimezone = "Asia/Kuala_Lumpur"

export const convertTimestampToUserTimezone = (timestamp: Timestamp) => {
  if(!timestamp){
    return ""
  }
  return moment(timestamp.toDate()).tz(userTimezone).format('YYYY-MM-DD HH:mm:ss');
}
