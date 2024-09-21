import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getDatabase } from "firebase-admin/database";
import { initializeApp, cert, App } from 'firebase-admin/app';
import * as dotenv from 'dotenv';
import fs from "fs";
import { provideSingleton } from "../helper/provideSingleton";

dotenv.config();

@provideSingleton(FirebaseAdmin)
export class FirebaseAdmin {
  private static instance: FirebaseAdmin;
  public app: App;
  public auth: ReturnType<typeof getAuth>;
  public firestore: ReturnType<typeof getFirestore>;
  public database: ReturnType<typeof getDatabase>;

  constructor() {
    const jsonData = JSON.parse(
      fs.readFileSync("./service-account-file.json", "utf-8")
    );

    // Initialize Firebase
    this.app = initializeApp({
      credential: cert(jsonData),
      databaseURL: process.env.DATABASE_URL,
      projectId: process.env.PROJECT_ID
    });

    this.auth = getAuth(this.app);
    this.firestore = getFirestore(this.app);
    this.database = getDatabase(this.app);
  }
}