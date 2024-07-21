import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { CLOUD_STORAGE } from "../config/initFirebase";

export const uploadFile = (files: any[]) => {
  const fileURL = files.map((file) => {
    return new Promise<string>((resolve, reject) => {
      const storageRef = ref(CLOUD_STORAGE, `files/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          console.log(progress)
        },
        (error) => {
          reject(error);
        },
        async () => {
          try {
            const URL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log(URL)
            resolve(URL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  });

  return fileURL;
};
