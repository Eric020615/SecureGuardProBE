import {
  addDoc,
  and,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import firebase from "../config/initFirebase";
import moment from "moment";
import "moment-timezone";
import { FacilityBooking } from "../models/facilityBooking.mode";
import { convertDateStringToTimestamp } from "../helper/time";

const facilityDB = firebase.FIRESTORE;
const facilityCollection = collection(facilityDB, "facilityBooking");

export const createFacilityBookingRepository = async (
  data: FacilityBooking
) => {
  await addDoc(facilityCollection, Object.assign({}, data));
};

export const getFacilityBookingRepository = async (
  userId: string,
  isPast: boolean
) => {
  const q = query(
    facilityCollection,
    and(
      where("bookedBy", "==", userId),
      where(
        "startDate",
        isPast ? "<=" : ">",
        // take note of the timezone here
        convertDateStringToTimestamp(moment().tz("Asia/Kuala_Lumpur").toISOString())
      )
    )
  );
  const querySnapshot = await getDocs(q);
  let result: FacilityBooking[] = [];
  querySnapshot.forEach((doc) => {
    let data = doc.data() as FacilityBooking;
    data.bookingId = doc.id;
    result.push(data);
  });
  return result;
};

export const getAllFacilityBookingRepository = async () => {
  const q = query(facilityCollection);
  const querySnapshot = await getDocs(q);
  let result: FacilityBooking[] = [];
  querySnapshot.forEach((doc) => {
    let data = doc.data() as FacilityBooking;
    data.bookingId = doc.id;
    result.push(data);
  });
  return result;
};

export const cancelFacilityBookingRepository = async (data: FacilityBooking, bookingId: string) => {
  const docRef = doc(facilityCollection, bookingId);
  await updateDoc(docRef, { ...data });
};
