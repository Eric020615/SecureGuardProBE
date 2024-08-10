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
import { Visitor } from "../models/visitor.model";
import { convertDateStringToTimestamp } from "../helper/time";

const visitorDB = firebase.FIRESTORE;
const visitorCollection = collection(visitorDB, "visitor");

export const createVisitorRepository = async (visitor: Visitor) => {
  await addDoc(visitorCollection, Object.assign({}, visitor));
};

export const get = async () => {
  const q = query(visitorCollection);
  const querySnapshot = await getDocs(q);
  let result: Visitor[] = [];
  querySnapshot.forEach((doc) => {
    let data = doc.data() as Visitor;
    data.visitorId = doc.id;
    result.push(data);
  });
  return result;
};

export const getVisitorByResidentRepository = async (
  userId: string,
  isPast: boolean
) => {
  const q = query(
    visitorCollection,
    and(
      where("createdBy", "==", userId),
      where(
        "visitDateTime",
        isPast ? "<=" : ">",
        convertDateStringToTimestamp(moment().tz("Asia/Kuala_Lumpur").toISOString())
      )
    )
  );
  const querySnapshot = await getDocs(q);
  let result: Visitor[] = [];
  querySnapshot.forEach((doc) => {
    let data = doc.data() as Visitor;
    data.visitorId = doc.id;
    result.push(data);
  });
  return result;
};

export const getAllVisitorsRepository = async () => {
    const q = query(visitorCollection);
    const querySnapshot = await getDocs(q);
    let result: Visitor[] = [];
    querySnapshot.forEach((doc) => {
      let data = doc.data() as Visitor;
      data.visitorId = doc.id;
      result.push(data);
    });
    return result;
};