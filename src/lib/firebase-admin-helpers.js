import { storage, firestore } from "@/firebaseAdmin";
import { achievements, specialRewards } from "@/data/achievements";

// Helper for image upload
export const uploadImage = async (file, folder, filename) => {
  const storageRef = storage.ref(`${folder}/${filename}`);
  await storageRef.put(file);
  const downloadUrl = await storageRef.getDownloadURL();
  return downloadUrl;
};

// Bulk upload functions
export const bulkUploadAchievements = async () => {
  const batch = firestore.batch();

  for (const achievement of achievements) {
    const ref = firestore.collection("achievements").doc(achievement.id);
    batch.set(ref, achievement);
  }

  await batch.commit();
};

export const bulkUploadSpecialRewards = async () => {
  const batch = firestore.batch();

  for (const reward of specialRewards) {
    const ref = firestore.collection("specialRewards").doc(reward.id);
    batch.set(ref, reward);
  }

  await batch.commit();
};

// Delete all functions
export const deleteAllAchievements = async () => {
  const snapshot = await firestore.collection("achievements").get();
  const batch = firestore.batch();

  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();
};

export const deleteAllSpecialRewards = async () => {
  const snapshot = await firestore.collection("specialRewards").get();
  const batch = firestore.batch();

  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();
};
