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
  setDoc,
} from "firebase/firestore";
import firebase from "../config/initFirebase";
import "moment-timezone";
import { Resident, User } from "../models/user.model";
import { UserRecord } from "firebase-admin/auth";

const userDB = firebase.FIRESTORE;
const userCollection = collection(userDB, "user");
const residentCollection = collection(userDB, "resident");

export const createResidentRepository = async (
  user: User,
  resident: Resident,
  userId: string
) => {
  const userDocRef = doc(userCollection, userId);
  const residentDocRef = doc(residentCollection, userId);
  await setDoc(userDocRef, {...user});
  await setDoc(residentDocRef, {...resident});
};

export const GetUserByIdRepository = async (
  userId: string
) => {
  const docRef = doc(userCollection, userId);
  const userDoc = await getDoc(docRef);
  let result: User = {} as User;
  result = userDoc.data() as User;
  result.id = userDoc.id;
  return result;
};

export const GetUserListRepository = async (
  userList: UserRecord[]
) => {
  const userDocsPromise = userList.map(async (user) => {
    return await getDoc(doc(userCollection, user.uid));
  });
  let result: User[] = [];
  const userDocs = await Promise.all(userDocsPromise);
  result = userDocs.map((doc) => { 
    let user = doc.data() as User;
    user.id = doc.id;
    return user;
  });
  return result;
}

export const GetResidentDetailsRepository = async (
  userId: string
) => {
  const docRef = doc(residentCollection, userId);
  const resDoc = await getDoc(docRef);
  let result: Resident = {} as Resident;
  result = resDoc.data() as Resident;
  return result;
};
