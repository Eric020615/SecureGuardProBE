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
import firebase from "../config/firebase";
import moment from "moment";
import "moment-timezone";
import { Visitor } from "../models/visitor.model";

const visitorDB = firebase.FIRESTORE;
const visitorCollection = collection(visitorDB, "visitor");

export const createVisitorRepository = async (visitor: Visitor) => {
  await addDoc(visitorCollection, Object.assign({}, visitor));
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