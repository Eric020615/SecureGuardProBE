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
  return result;
};

export const GetUserListRepository = async (
) => {
  const q = query(userCollection);
  const querySnapshot = await getDocs(q);
  let result: User[] = [];
  querySnapshot.forEach((doc) => {
    let data = doc.data() as User;
    data.id = doc.id;
    result.push(data);
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
