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
import { Notice } from "../models/notice.model";
import moment from "moment";
import "moment-timezone";

const noticesDB = firebase.FIRESTORE;
const noticeCollection = collection(noticesDB, "notice");

export const createNoticeRepository = async (notice: Notice) => {
  await addDoc(noticeCollection, Object.assign({}, notice));
};

export const getAllNoticeRepository = async () => {
  const q = query(noticeCollection);
  const querySnapshot = await getDocs(q);
  let result: Notice[] = [];
  querySnapshot?.forEach((doc) => {
    let data = doc.data() as Notice;
    data.noticeId = doc.id;
    result.push(data);
  });
  return result;
};

export const getNoticeRepository = async () => {
  const q = query(
    noticeCollection,
    and(
      where("startDate", "<=", moment().tz("Asia/Kuala_Lumpur").valueOf()),
      where("endDate", ">", moment().tz("Asia/Kuala_Lumpur").valueOf())
    ),
    orderBy("startDate")
  );
  const querySnapshot = await getDocs(q);
  let result: Notice[] = [];
  querySnapshot?.forEach((doc) => {
    let data = doc.data() as Notice;
    data.noticeId = doc.id;
    result.push(data);
  });
  return result;
};

export const getNoticeByIdRepository = async (id: string) => {
  const noticeDocRef = doc(noticeCollection, id);
  const noticeDoc = await getDoc(noticeDocRef);
  let result: Notice = {} as Notice;
  result = noticeDoc.data() as Notice;
  result.noticeId = noticeDoc.id;
  return result;
};

export const editNoticeByIdRepository = async (id: string, notice: Notice) => {
  const docRef = doc(noticeCollection, id);
  await updateDoc(docRef, { ...notice });
};

export const deleteNoticeByIdRepository = async (id: string) => {
  const docRef = doc(noticeCollection, id);
  await deleteDoc(docRef);
};
