import { defineStore } from 'pinia';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { FIREBASE_CONFIG } from '@/constants';

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

export const useTwitchStore = defineStore('twitch', {
  state: () => ({
    twitchToken: null,
  }),

  actions: {
    async getTwitchToken() {
      const docRef = doc(db, 'app', 'twitch');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.twitchToken = docSnap.data();
      }
    },

    setTwitchToken(token) {
      this.twitchToken = token;
    },
  },
});

