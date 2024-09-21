import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  uploadString,
} from "firebase/storage";
import FirebaseClient from "../config/initFirebase";
import { GeneralFileDto } from "../dtos/index.dto";
import { iocContainer } from "../ioc";

export const uploadFile = async (files: GeneralFileDto[], userId: string) => {
  try {
    // problem
    let cloudStorage = new FirebaseClient().storage
    const fileURLs = await Promise.all(files.map(async (file, index) => {
      const storageRef = ref(cloudStorage, `supportedFiles/${userId}/${file.fileName}`);
      const snapshot = await uploadString(storageRef, file.data, "base64");
      const fileURL = await getDownloadURL(snapshot.ref)
      return fileURL;
    }));
    return fileURLs;
  } catch (error) {
    console.error(error);
  }
};
