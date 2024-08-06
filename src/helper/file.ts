import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  uploadString,
} from "firebase/storage";
import { CLOUD_STORAGE } from "../config/initFirebase";
import { GeneralFileDto } from "../dtos/index.dto";

export const uploadFile = async (files: GeneralFileDto[], userId: string) => {
  try {
    const fileURLs = await Promise.all(files.map(async (file, index) => {
      const storageRef = ref(CLOUD_STORAGE, `supportedFiles/${userId}/${file.fileName}`);
      const snapshot = await uploadString(storageRef, file.data, "base64");
      const fileURL = await getDownloadURL(snapshot.ref)
      return fileURL;
    }));
    return fileURLs;
  } catch (error) {
    console.error(error);
  }
};
