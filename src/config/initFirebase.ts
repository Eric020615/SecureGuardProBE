import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getDatabase, Database } from "firebase/database";
import { getStorage, FirebaseStorage } from "firebase/storage";
import * as dotenv from 'dotenv';
import { provideSingleton } from "../helper/provideSingleton";

dotenv.config();

@provideSingleton(FirebaseClient)
export class FirebaseClient {
  private static instance: FirebaseClient;
  public app: ReturnType<typeof initializeApp>;
  public auth: Auth;
  public firestore: Firestore;
  public storage: FirebaseStorage;
  public database: Database;

  constructor() {
    const firebaseConfig = {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      measurementId: process.env.MEASUREMENT_ID,
      databaseURL: process.env.DATABASE_URL
    };

    // Initialize Firebase
    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth(this.app);
    this.firestore = getFirestore(this.app);
    this.storage = getStorage(this.app);
    this.database = getDatabase(this.app);
  }

  // Implement Singleton pattern to ensure one instance of FirebaseClient
  public static getInstance(): FirebaseClient {
    if (!this.instance) {
      this.instance = new FirebaseClient();
    }
    return this.instance;
  }
}

export default FirebaseClient;
