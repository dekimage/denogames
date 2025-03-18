import { storage, firestore } from "@/firebaseAdmin";

// Helper for image upload
export const uploadImage = async (file, folder, filename) => {
  const storageRef = storage.ref(`${folder}/${filename}`);
  await storageRef.put(file);
  const downloadUrl = await storageRef.getDownloadURL();
  return downloadUrl;
};
