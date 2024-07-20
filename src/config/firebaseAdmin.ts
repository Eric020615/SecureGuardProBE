// Import the functions you need from the SDKs you need
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getDatabase } from "firebase-admin/database";
import { initializeApp, cert } from 'firebase-admin/app';
import * as dotenv from 'dotenv';
import fs from "fs"

dotenv.config();
let jsonData = JSON.parse(
  fs.readFileSync("./service-account-file.json", "utf-8")
);

// Initialize Firebase
const FIREBASE_ADMIN_APP = initializeApp({
  credential: cert(jsonData),
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID
});
const FIREBASE_ADMIN_AUTH = getAuth(FIREBASE_ADMIN_APP);
const FIRESTORE_ADMIN = getFirestore(FIREBASE_ADMIN_APP);
const DB_ADMIN = getDatabase(FIREBASE_ADMIN_APP)

export default { FIREBASE_ADMIN_APP, FIREBASE_ADMIN_AUTH, FIRESTORE_ADMIN, DB_ADMIN }