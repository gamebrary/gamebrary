import { defineStore } from 'pinia';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { FIREBASE_CONFIG } from '@/constants';

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    settings: {},
  }),

  persist: {
    paths: ['settings'],
  },

  getters: {
    darkTheme: (state) => state.settings?.darkTheme || false,
    transparencyEnabled: (state) => state.settings?.transparencyEnabled || false,
    showGameThumbnails: (state) => state.settings?.showGameThumbnails || false,
    navPosition: (state) => state.settings?.navPosition || 'top',
    ageRating: (state) => state.settings?.ageRating || 'all',
    isRTL: (state) => state.settings?.language !== 'ar',
  },

  actions: {
    async loadSettings(userId) {
      const docSnap = await getDoc(doc(db, 'settings', userId));
      this.settings = docSnap.data() || {};
    },

    async saveSettings(userId, settings) {
      await setDoc(doc(db, 'settings', userId), settings);
      this.settings = settings;
    },

    updateSetting(key, value) {
      if (!this.settings) {
        this.settings = {};
      }
      this.settings[key] = value;
    },
  },
});

