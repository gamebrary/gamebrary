import { getStorage, ref as firebaseStorageRef, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { FIREBASE_CONFIG } from '@/constants';

const app = initializeApp(FIREBASE_CONFIG);
const storage = getStorage(app);

export const loadFirebaseImage = async (path) => {
  return await getDownloadURL(firebaseStorageRef(storage, path));
};

