import { defineStore } from 'pinia';
import { getFirestore, doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { FIREBASE_CONFIG } from '@/constants';

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);
const storage = getStorage();

export const useProfileStore = defineStore('profile', {
  state: () => ({
    profile: {},
    profiles: [],
  }),

  persist: {
    paths: ['profile'],
  },

  actions: {
    async loadProfile(userId) {
      const docSnap = await getDoc(doc(db, 'profiles', userId));
      this.profile = docSnap.data() || {};
      return docSnap.data();
    },

    async loadProfiles() {
      const querySnapshot = await getDocs(query(collection(db, 'profiles')));
      const profiles = querySnapshot.docs.map((doc) => doc.data());
      this.profiles = profiles;
    },

    async loadPublicProfileByUsername(userName) {
      const q = query(collection(db, 'profiles'), where('userName', '==', userName));
      const querySnapshot = await getDocs(q);
      const [profile] = querySnapshot.docs.map((doc) => ({ ...doc.data(), uid: doc.id }));
      return profile;
    },

    async loadPublicProfileByUserId(userId) {
      const profileDocRef = doc(db, 'profiles', userId);
      const docSnapshot = await getDoc(profileDocRef);

      if (!docSnapshot.exists()) throw new Error('Profile not found');

      return docSnapshot.data();
    },

    async saveProfile(userId, profile) {
      await setDoc(doc(db, 'profiles', userId), profile);
      this.profile = profile;
      return profile;
    },

    async uploadProfileAvatar(userId, file) {
      const storageRef = ref(storage, `${userId}/avatars/${file.name}`);
      const uploadedFile = await uploadBytes(storageRef, file);
      return uploadedFile.metadata.fullPath;
    },

    async deleteProfile(userId) {
      await deleteDoc(doc(db, 'profiles', userId));
      this.profile = {};
    },

    async checkProfileUsernameAvailability(userName) {
      const querySnapshot = await getDocs(query(collection(db, 'profiles'), where('userName', '==', userName)));
      return querySnapshot?.empty;
    },

    setProfile(profile) {
      this.profile = profile;
    },

    removeProfile() {
      this.profile = {};
    },

    setProfiles(profiles) {
      this.profiles = profiles;
    },
  },
});

