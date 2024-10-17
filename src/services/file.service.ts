import { ref, uploadString, getDownloadURL, getStorage } from "firebase/storage";
import { inject } from 'inversify';
import { FirebaseClient } from '../config/initFirebase'; // adjust the path as needed
import { GeneralFileDto } from "../dtos/index.dto";
import { provideSingleton } from "../helper/provideSingleton";

@provideSingleton(FileService)
export class FileService {
  private storage: ReturnType<typeof getStorage>;

  constructor(
    @inject(FirebaseClient)
    private firebaseClient: FirebaseClient // Inject and persist FirebaseClient
  ) {
    this.storage = this.firebaseClient.storage; // Store the storage instance
  }

  public uploadFile = async (files: GeneralFileDto[], userId: string) => {
    try {
      // Now use this.storage which persists across the method
      const fileURLs = await Promise.all(files.map(async (file, index) => {
        const storageRef = ref(this.storage, `supportedFiles/${userId}/${file.fileName}`);
        const snapshot = await uploadString(storageRef, file.data, "base64");
        const fileURL = await getDownloadURL(snapshot.ref);
        return fileURL;
      }));
      return fileURLs;
    } catch (error) {
      console.error(error);
      throw new Error('File upload failed');
    }
  };
}
