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

export const getUserInformationRepository = async (
  userId: string
) => {
  const docRef = doc(userCollection, userId);
  const userDoc = await getDoc(docRef);
  let result: User = {} as User;
  result = userDoc.data() as User;
  return result;
};